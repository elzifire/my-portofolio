import { describe, it, expect } from 'vitest'
import {
  checkWinner,
  getEmptyCells,
  easyBotMove,
  hardBotMove,
  type Cell,
} from '../../app/utils/tictactoeGame'

describe('checkWinner', () => {
  it('returns null when board is empty', () => {
    const board: Cell[] = Array(9).fill(null)
    expect(checkWinner(board)).toEqual({ winner: null, line: null })
  })

  it('detects X winning on top row', () => {
    const board: Cell[] = ['X', 'X', 'X', 'O', 'O', null, null, null, null]
    const result = checkWinner(board)
    expect(result.winner).toBe('X')
    expect(result.line).toEqual([0, 1, 2])
  })

  it('detects O winning on diagonal', () => {
    const board: Cell[] = ['O', 'X', 'X', null, 'O', 'X', null, null, 'O']
    const result = checkWinner(board)
    expect(result.winner).toBe('O')
    expect(result.line).toEqual([0, 4, 8])
  })

  it('detects a draw', () => {
    const board: Cell[] = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']
    const result = checkWinner(board)
    expect(result.winner).toBe('draw')
    expect(result.line).toBeNull()
  })

  it('returns null when game is still in progress', () => {
    const board: Cell[] = ['X', 'O', null, null, 'X', null, null, null, null]
    expect(checkWinner(board).winner).toBeNull()
  })

  it('detects win on column', () => {
    const board: Cell[] = ['O', 'X', null, 'O', 'X', null, 'O', null, null]
    const result = checkWinner(board)
    expect(result.winner).toBe('O')
    expect(result.line).toEqual([0, 3, 6])
  })

  it('detects win on anti-diagonal', () => {
    const board: Cell[] = [null, null, 'X', null, 'X', null, 'X', 'O', 'O']
    const result = checkWinner(board)
    expect(result.winner).toBe('X')
    expect(result.line).toEqual([2, 4, 6])
  })
})

describe('getEmptyCells', () => {
  it('returns all indices for empty board', () => {
    expect(getEmptyCells(Array(9).fill(null))).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
  })

  it('returns no indices for full board', () => {
    const board: Cell[] = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']
    expect(getEmptyCells(board)).toEqual([])
  })

  it('returns only empty cell indices', () => {
    const board: Cell[] = ['X', null, 'O', null, null, 'X', 'O', null, 'X']
    expect(getEmptyCells(board)).toEqual([1, 3, 4, 7])
  })
})

describe('easyBotMove', () => {
  it('returns -1 on a full board', () => {
    const board: Cell[] = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']
    expect(easyBotMove(board)).toBe(-1)
  })

  it('returns an empty cell index', () => {
    const board: Cell[] = ['X', 'O', 'X', null, 'O', null, 'O', 'X', 'X']
    const move = easyBotMove(board)
    expect([3, 5]).toContain(move)
  })

  it('returns the only empty cell when one remains', () => {
    const board: Cell[] = ['X', 'O', 'X', 'X', 'O', 'O', 'O', null, 'X']
    expect(easyBotMove(board)).toBe(7)
  })
})

describe('hardBotMove (minimax with alpha-beta)', () => {
  it('takes the winning move', () => {
    // O can win at index 2
    const board: Cell[] = ['O', 'O', null, 'X', 'X', null, null, null, null]
    expect(hardBotMove(board)).toBe(2)
  })

  it('blocks opponent from winning', () => {
    // X is about to win at index 2, O must block
    const board: Cell[] = ['X', 'X', null, 'O', null, null, null, null, null]
    expect(hardBotMove(board)).toBe(2)
  })

  it('takes center on empty board', () => {
    const board: Cell[] = ['X', null, null, null, null, null, null, null, null]
    // Best response is center (4)
    expect(hardBotMove(board)).toBe(4)
  })

  it('never loses — hard bot always draws or wins against any X move', () => {
    // Simulate: X plays corner, O responds, X plays random...
    // Hard bot (O) should never lose
    function playGame(): 'X' | 'O' | 'draw' {
      const b: Cell[] = Array(9).fill(null)
      let turn: 'X' | 'O' = 'X'
      while (true) {
        if (turn === 'X') {
          const empty = getEmptyCells(b)
          if (empty.length === 0) return 'draw'
          b[empty[Math.floor(Math.random() * empty.length)]] = 'X'
        } else {
          const move = hardBotMove([...b])
          if (move === -1) return 'draw'
          b[move] = 'O'
        }
        const result = checkWinner(b)
        if (result.winner === 'X') return 'X'
        if (result.winner === 'O') return 'O'
        if (result.winner === 'draw') return 'draw'
        turn = turn === 'X' ? 'O' : 'X'
      }
    }

    // Run 50 random games — bot should never lose
    for (let i = 0; i < 50; i++) {
      const result = playGame()
      expect(result).not.toBe('X')
    }
  })

  it('returns -1 on full board', () => {
    const board: Cell[] = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']
    expect(hardBotMove(board)).toBe(-1)
  })

  it('prefers winning over blocking', () => {
    // O has 2,4 — can win at 6 (anti-diagonal). X threatens 0,1 at index 2 but O already there.
    const board: Cell[] = ['X', 'X', 'O', null, 'O', null, null, null, null]
    expect(hardBotMove(board)).toBe(6)
  })
})
