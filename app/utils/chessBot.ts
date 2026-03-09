/**
 * Chess Bot Algorithm
 * Using Minimax with Alpha-Beta Pruning
 * 
 * Difficulty levels are controlled by:
 * - Search depth (deeper = stronger)
 * - Randomness factor (to make easier levels make mistakes)
 */

// Piece values for evaluation
const PIECE_VALUES: Record<string, number> = {
  p: 100,   // pawn
  n: 320,   // knight
  b: 330,   // bishop
  r: 500,   // rook
  q: 900,   // queen
  k: 20000  // king
}

// Piece-square tables for positional evaluation
// Values are added to piece values based on position
const PAWN_TABLE = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5,  5, 10, 25, 25, 10,  5,  5],
  [0,  0,  0, 20, 20,  0,  0,  0],
  [5, -5,-10,  0,  0,-10, -5,  5],
  [5, 10, 10,-20,-20, 10, 10,  5],
  [0,  0,  0,  0,  0,  0,  0,  0]
]

const KNIGHT_TABLE = [
  [-50,-40,-30,-30,-30,-30,-40,-50],
  [-40,-20,  0,  0,  0,  0,-20,-40],
  [-30,  0, 10, 15, 15, 10,  0,-30],
  [-30,  5, 15, 20, 20, 15,  5,-30],
  [-30,  0, 15, 20, 20, 15,  0,-30],
  [-30,  5, 10, 15, 15, 10,  5,-30],
  [-40,-20,  0,  5,  5,  0,-20,-40],
  [-50,-40,-30,-30,-30,-30,-40,-50]
]

const BISHOP_TABLE = [
  [-20,-10,-10,-10,-10,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5, 10, 10,  5,  0,-10],
  [-10,  5,  5, 10, 10,  5,  5,-10],
  [-10,  0, 10, 10, 10, 10,  0,-10],
  [-10, 10, 10, 10, 10, 10, 10,-10],
  [-10,  5,  0,  0,  0,  0,  5,-10],
  [-20,-10,-10,-10,-10,-10,-10,-20]
]

const ROOK_TABLE = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [5, 10, 10, 10, 10, 10, 10,  5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [0,  0,  0,  5,  5,  0,  0,  0]
]

const QUEEN_TABLE = [
  [-20,-10,-10, -5, -5,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5,  5,  5,  5,  0,-10],
  [-5,  0,  5,  5,  5,  5,  0, -5],
  [0,  0,  5,  5,  5,  5,  0, -5],
  [-10,  5,  5,  5,  5,  5,  0,-10],
  [-10,  0,  5,  0,  0,  0,  0,-10],
  [-20,-10,-10, -5, -5,-10,-10,-20]
]

const KING_MIDDLE_TABLE = [
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-20,-30,-30,-40,-40,-30,-30,-20],
  [-10,-20,-20,-20,-20,-20,-20,-10],
  [20, 20,  0,  0,  0,  0, 20, 20],
  [20, 30, 10,  0,  0, 10, 30, 20]
]

const KING_END_TABLE = [
  [-50,-40,-30,-20,-20,-30,-40,-50],
  [-30,-20,-10,  0,  0,-10,-20,-30],
  [-30,-10, 20, 30, 30, 20,-10,-30],
  [-30,-10, 30, 40, 40, 30,-10,-30],
  [-30,-10, 30, 40, 40, 30,-10,-30],
  [-30,-10, 20, 30, 30, 20,-10,-30],
  [-30,-30,  0,  0,  0,  0,-30,-30],
  [-50,-30,-30,-30,-30,-30,-30,-50]
]

// Difficulty settings
export interface DifficultyLevel {
  name: string
  depth: number
  randomness: number // 0-100, higher = more random moves
  description: string
}

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  {
    name: 'Beginner',
    depth: 1,
    randomness: 50,
    description: 'Easy opponent, makes many mistakes'
  },
  {
    name: 'Easy',
    depth: 2,
    randomness: 30,
    description: 'Casual play, some mistakes'
  },
  {
    name: 'Medium',
    depth: 3,
    randomness: 15,
    description: 'Balanced challenge'
  },
  {
    name: 'Hard',
    depth: 4,
    randomness: 5,
    description: 'Strong opponent, few mistakes'
  },
  {
    name: 'Expert',
    depth: 5,
    randomness: 0,
    description: 'Maximum difficulty, optimal play'
  }
]

// Chess.js type interface
interface ChessInstance {
  turn(): 'w' | 'b'
  moves(): string[]
  move(move: string): { captured?: string } | null
  undo(): { move: string } | null
  fen(): string
  inCheck(): boolean
  isCheckmate(): boolean
  isStalemate(): boolean
  isDraw(): boolean
  isGameOver(): boolean
  board(): (null | { type: string; color: 'w' | 'b' })[][]
  ascii(): string
}

/**
 * Get the piece-square table value for a piece at a position
 */
function getPieceSquareValue(piece: string, color: 'w' | 'b', row: number, col: number, isEndgame: boolean): number {
  // Flip the table for black pieces
  const r = color === 'w' ? row : 7 - row
  
  switch (piece) {
    case 'p': return PAWN_TABLE[r]?.[col] ?? 0
    case 'n': return KNIGHT_TABLE[r]?.[col] ?? 0
    case 'b': return BISHOP_TABLE[r]?.[col] ?? 0
    case 'r': return ROOK_TABLE[r]?.[col] ?? 0
    case 'q': return QUEEN_TABLE[r]?.[col] ?? 0
    case 'k': return isEndgame ? (KING_END_TABLE[r]?.[col] ?? 0) : (KING_MIDDLE_TABLE[r]?.[col] ?? 0)
    default: return 0
  }
}

/**
 * Check if we're in an endgame position
 */
function isEndgame(board: (null | { type: string; color: 'w' | 'b' })[][]): boolean {
  let queens = 0
  let minorPieces = 0
  
  for (const row of board) {
    for (const square of row) {
      if (square) {
        if (square.type === 'q') queens++
        if (square.type === 'n' || square.type === 'b') minorPieces++
      }
    }
  }
  
  return queens === 0 || (queens <= 2 && minorPieces <= 2)
}

/**
 * Evaluate the board position
 * Positive score = white advantage, Negative = black advantage
 */
function evaluateBoard(chess: ChessInstance): number {
  const board = chess.board()
  const endgame = isEndgame(board)
  
  let score = 0
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = board[row]?.[col]
      if (square) {
        const pieceValue = PIECE_VALUES[square.type] || 0
        const positionValue = getPieceSquareValue(square.type, square.color, row, col, endgame)
        
        const totalValue = pieceValue + positionValue
        score += square.color === 'w' ? totalValue : -totalValue
      }
    }
  }
  
  // Bonus for having the opponent in check
  if (chess.inCheck()) {
    score += chess.turn() === 'w' ? -50 : 50
  }
  
  return score
}

/**
 * Order moves for better alpha-beta pruning.
 * Captures and checks are evaluated first.
 */
function orderMoves(chess: ChessInstance, moves: string[]): string[] {
  const scoredMoves: [string, number][] = []

  for (const move of moves) {
    let score = 0
    try {
      const result = chess.move(move)
      if (result) {
        if (result.captured) {
          score += (PIECE_VALUES[result.captured] || 0) * 10
        }
        if (chess.inCheck()) score += 500
        chess.undo()
      }
    } catch {
      try { chess.undo() } catch { /* already clean */ }
    }
    scoredMoves.push([move, score])
  }

  scoredMoves.sort((a, b) => b[1] - a[1])
  return scoredMoves.map(([move]) => move)
}

/**
 * Minimax algorithm with Alpha-Beta pruning.
 * Every move() is guaranteed to have a matching undo().
 */
function minimax(
  chess: ChessInstance,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
): number {
  if (depth === 0 || chess.isGameOver()) {
    return evaluateBoard(chess)
  }

  const moves = chess.moves()
  if (moves.length === 0) return evaluateBoard(chess)

  const ordered = orderMoves(chess, moves)

  if (isMaximizing) {
    let maxEval = -Infinity
    for (const move of ordered) {
      const result = chess.move(move)
      if (!result) continue
      const evalScore = minimax(chess, depth - 1, alpha, beta, false)
      chess.undo()
      maxEval = Math.max(maxEval, evalScore)
      alpha = Math.max(alpha, evalScore)
      if (beta <= alpha) break
    }
    return maxEval
  } else {
    let minEval = Infinity
    for (const move of ordered) {
      const result = chess.move(move)
      if (!result) continue
      const evalScore = minimax(chess, depth - 1, alpha, beta, true)
      chess.undo()
      minEval = Math.min(minEval, evalScore)
      beta = Math.min(beta, evalScore)
      if (beta <= alpha) break
    }
    return minEval
  }
}

/**
 * Find the best move for the bot.
 *
 * Every move()/undo() pair is wrapped in try-catch so the engine
 * never leaves the chess instance in a dirty state.
 */
export function findBestMove(
  chess: ChessInstance,
  difficulty: DifficultyLevel,
): string | null {
  const moves = chess.moves()
  if (moves.length === 0) return null
  if (moves.length === 1) return moves[0]! // only one option

  const isBotWhite = chess.turn() === 'w'
  const scoredMoves: [string, number][] = []

  for (const move of moves) {
    try {
      const result = chess.move(move)
      if (!result) continue
      const score = minimax(
        chess,
        difficulty.depth - 1,
        -Infinity,
        Infinity,
        !isBotWhite,
      )
      chess.undo()
      scoredMoves.push([move, isBotWhite ? score : -score])
    } catch {
      try { chess.undo() } catch { /* already clean */ }
    }
  }

  // Fallback if no moves were scored (shouldn't happen)
  if (scoredMoves.length === 0) {
    return moves[Math.floor(Math.random() * moves.length)] ?? null
  }

  // Sort (best first)
  scoredMoves.sort((a, b) => b[1] - a[1])

  // Apply randomness so easier levels feel human
  if (difficulty.randomness > 0 && scoredMoves.length > 1) {
    const topScore = scoredMoves[0]![1]
    const threshold = topScore - difficulty.randomness * 10
    const candidates = scoredMoves.filter(([, s]) => s >= threshold)
    const idx = Math.floor(Math.random() * candidates.length)
    return candidates[idx]?.[0] ?? scoredMoves[0]![0]
  }

  return scoredMoves[0]![0] ?? null
}

/**
 * Get a random legal move (for very easy difficulty)
 */
export function getRandomMove(chess: ChessInstance): string | null {
  const moves = chess.moves()
  if (moves.length === 0) return null
  return moves[Math.floor(Math.random() * moves.length)] ?? null
}

/**
 * Analyze position and return evaluation
 */
export function analyzePosition(chess: ChessInstance): {
  score: number
  mate: number | null
  bestMove: string | null
} {
  const score = evaluateBoard(chess)
  
  let mate: number | null = null
  if (chess.isCheckmate()) {
    mate = chess.turn() === 'w' ? 0 : 0 // Black wins or White wins
  }
  
  const bestMove = findBestMove(chess, DIFFICULTY_LEVELS[3]!) // Use Hard difficulty for analysis
  
  return { score, mate, bestMove }
}
