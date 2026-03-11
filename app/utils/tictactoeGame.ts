export type Cell = 'X' | 'O' | null

export interface WinResult {
  winner: 'X' | 'O' | 'draw' | null
  line: number[] | null
}

export const WIN_COMBOS: [number, number, number][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

export function checkWinner(board: Cell[]): WinResult {
  for (const [a, b, c] of WIN_COMBOS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a]!, line: [a, b, c] }
    }
  }
  if (board.every(cell => cell !== null)) return { winner: 'draw', line: null }
  return { winner: null, line: null }
}

export function getEmptyCells(board: Cell[]): number[] {
  return board.reduce<number[]>((acc, cell, i) => {
    if (cell === null) acc.push(i)
    return acc
  }, [])
}

export function easyBotMove(board: Cell[]): number {
  const empty = getEmptyCells(board)
  if (empty.length === 0) return -1
  return empty[Math.floor(Math.random() * empty.length)]!
}

/** Minimax with alpha-beta pruning for O (maximizer) vs X (minimizer) */
function minimax(board: Cell[], isMax: boolean, alpha: number, beta: number, depth: number): number {
  const result = checkWinner(board)
  if (result.winner === 'O') return 10 - depth
  if (result.winner === 'X') return depth - 10
  if (result.winner === 'draw') return 0

  if (isMax) {
    let best = -Infinity
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O'
        best = Math.max(best, minimax(board, false, alpha, beta, depth + 1))
        board[i] = null
        alpha = Math.max(alpha, best)
        if (beta <= alpha) break
      }
    }
    return best
  } else {
    let best = Infinity
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'X'
        best = Math.min(best, minimax(board, true, alpha, beta, depth + 1))
        board[i] = null
        beta = Math.min(beta, best)
        if (beta <= alpha) break
      }
    }
    return best
  }
}

export function hardBotMove(board: Cell[]): number {
  let bestScore = -Infinity
  let bestMove = -1
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = 'O'
      const score = minimax(board, false, -Infinity, Infinity, 0)
      board[i] = null
      if (score > bestScore) {
        bestScore = score
        bestMove = i
      }
    }
  }
  return bestMove
}
