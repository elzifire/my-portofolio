/**
 * Ludo Bot AI
 *
 * Weighted heuristic for picking the best move.
 * Separated from the composable so it can be tested independently.
 */

import type { LudoMove } from '@nanowiz/ludo.js'

/** Score weights — tweak these to change bot personality */
const W = {
  CAPTURE: 100,
  INITIAL: 60,
  GOAL: 200,
  SAFE: 30,
  REPEAT: 40,
  RANDOM_MAX: 15,
} as const

/**
 * Evaluate all available moves and return the best one.
 * Uses a deterministic score + small random jitter for variety.
 */
export function pickBestMove(moves: LudoMove[]): LudoMove {
  if (moves.length <= 1) return moves[0]!

  let best: LudoMove = moves[0]!
  let bestScore = -Infinity

  for (const m of moves) {
    let score = 0

    if (m.capture.length > 0) score += W.CAPTURE
    if (m.isInitial) score += W.INITIAL
    if (m.to.type === 'goal') score += W.GOAL
    if (m.to.type === 'safe' || m.to.type === 'safe-end' || m.to.type === 'safe-way') score += W.SAFE
    if (m.isRepeat) score += W.REPEAT

    // Prefer pieces further along the board
    score += (m.to.index - m.from.index + 23) % 23

    // Small randomness for variety
    score += Math.random() * W.RANDOM_MAX

    if (score > bestScore) {
      bestScore = score
      best = m
    }
  }

  return best
}
