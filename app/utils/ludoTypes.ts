/**
 * Shared types for Ludo components
 */

import type { LudoMove } from '@nanowiz/ludo.js'

/** A piece positioned and ready to render on the SVG board */
export interface RenderedPiece {
  name: string
  index: number
  cx: number
  cy: number
  fill: string
  stroke: string
  selectable: boolean
  atGoal: boolean
  moveRef: LudoMove | null
}

/** Player slot configuration from setup screen */
export interface PlayerSlot {
  id: string
  type: 'human' | 'bot' | 'none'
}

/** Post-game match statistics */
export interface MatchStats {
  totalMoves: number
  captures: number
  highestStreak: number
}
