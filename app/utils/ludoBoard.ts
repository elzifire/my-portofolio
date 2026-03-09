/**
 * Ludo Board Layout Constants & Utilities
 *
 * All board geometry, track mapping, piece positioning logic,
 * and SVG coordinate helpers live here.
 */

// ─── SVG Grid Constants ──────────────────────────────────────────────────────

export const CELL = 36
export const GAP = 2
export const STRIDE = CELL + GAP
export const BOARD_OFFSET_X = 14
export const BOARD_OFFSET_Y = 14

/** Convert grid col/row to SVG [x, y] top-left corner */
export function cellXY(col: number, row: number): [number, number] {
  return [BOARD_OFFSET_X + col * STRIDE, BOARD_OFFSET_Y + row * STRIDE]
}

// ─── Home base circle positions (SVG coords) ────────────────────────────────

export const HOME_POSITIONS: Record<string, [number, number][]> = {
  a: [[75, 75], [165, 75], [75, 165], [165, 165]],
  b: [[435, 75], [525, 75], [435, 165], [525, 165]],
  c: [[75, 435], [165, 435], [75, 525], [165, 525]],
  d: [[435, 435], [525, 435], [435, 525], [525, 525]],
}

/** Safe template accessor – avoids `!` in Vue templates */
export function getHomePos(player: string, index: number, axis: 0 | 1): number {
  return HOME_POSITIONS[player]?.[index]?.[axis] ?? 300
}

// ─── Board Cell types ────────────────────────────────────────────────────────

export interface BoardCell {
  x: number
  y: number
  row: number
  col: number
  fill: string
  stroke: string
}

interface SpecialCell {
  col: number
  row: number
  color: string
  strokeColor: string
}

/** Build renderable cell array for one arm of the cross */
export function buildArmCells(
  cells: { row: number; col: number }[],
  specials?: SpecialCell[],
): BoardCell[] {
  return cells.map(c => {
    const [x, y] = cellXY(c.col, c.row)
    const spec = specials?.find(s => s.col === c.col && s.row === c.row)
    return {
      x, y,
      row: c.row,
      col: c.col,
      fill: spec?.color ?? '#374151',
      stroke: spec?.strokeColor ?? '#4b5563',
    }
  })
}

/** Generate all grid cells in a rectangular region */
export function makeGridCells(
  rowRange: [number, number],
  colRange: [number, number],
): { row: number; col: number }[] {
  const cells: { row: number; col: number }[] = []
  for (let r = rowRange[0]; r <= rowRange[1]; r++) {
    for (let c = colRange[0]; c <= colRange[1]; c++) {
      cells.push({ row: r, col: c })
    }
  }
  return cells
}

// ─── Pre-built arm grid cells ────────────────────────────────────────────────

export const TOP_ARM_CELLS    = makeGridCells([0, 5], [6, 8])
export const BOTTOM_ARM_CELLS = makeGridCells([9, 14], [6, 8])
export const LEFT_ARM_CELLS   = makeGridCells([6, 8], [0, 5])
export const RIGHT_ARM_CELLS  = makeGridCells([6, 8], [9, 14])

// ─── Special coloured cells (safe-end paths + start squares) ─────────────────

export const RED_SAFE_END    = Array.from({ length: 5 }, (_, i): SpecialCell => ({ row: i + 1, col: 7, color: '#fecaca', strokeColor: '#ef4444' }))
export const BLUE_SAFE_END   = Array.from({ length: 5 }, (_, i): SpecialCell => ({ row: 7, col: 13 - i, color: '#bfdbfe', strokeColor: '#3b82f6' }))
export const GREEN_SAFE_END  = Array.from({ length: 5 }, (_, i): SpecialCell => ({ row: 7, col: i + 1, color: '#bbf7d0', strokeColor: '#22c55e' }))
export const YELLOW_SAFE_END = Array.from({ length: 5 }, (_, i): SpecialCell => ({ row: 13 - i, col: 7, color: '#fef08a', strokeColor: '#eab308' }))

export const RED_START: SpecialCell    = { row: 0, col: 6, color: '#fecaca', strokeColor: '#ef4444' }
export const BLUE_START: SpecialCell   = { row: 6, col: 14, color: '#bfdbfe', strokeColor: '#3b82f6' }
export const GREEN_START: SpecialCell  = { row: 8, col: 0, color: '#bbf7d0', strokeColor: '#22c55e' }
export const YELLOW_START: SpecialCell = { row: 14, col: 8, color: '#fef08a', strokeColor: '#eab308' }

// ─── Safe square marker positions ────────────────────────────────────────────

export const SAFE_SQUARE_CELLS = [
  { row: 0, col: 8 }, { row: 2, col: 6 },
  { row: 6, col: 0 }, { row: 8, col: 2 },
  { row: 8, col: 12 }, { row: 6, col: 14 },
  { row: 12, col: 8 }, { row: 14, col: 6 },
]

// ─── 52-cell clockwise track as [col, row] ──────────────────────────────────

export const TRACK: [number, number][] = [
  [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],       // top-left arm ↓
  [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],       // top of left arm ←
  [0, 7], [0, 8],                                         // left edge ↓
  [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],                // bottom of left arm →
  [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14],  // bottom-left arm ↓
  [7, 14], [8, 14],                                       // bottom edge →
  [8, 13], [8, 12], [8, 11], [8, 10], [8, 9],            // bottom-right arm ↑
  [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8],  // bottom of right arm →
  [14, 7], [14, 6],                                       // right edge ↑
  [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],            // top of right arm ←
  [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0],       // top-right arm ↑
  [7, 0],                                                 // top edge ←
]

// ─── Safe-end paths per player (5 cells leading to goal) ─────────────────────

export const SAFE_END_PATHS: Record<string, [number, number][]> = {
  a: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]],
  b: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]],
  c: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
  d: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]],
}

export const GOAL_POS: [number, number] = [7, 7]

/** Player entry points on the 52-cell track */
export const PLAYER_ENTRY: Record<string, number> = { a: 0, b: 13, c: 26, d: 39 }

// ─── Library index ↔ board position mapping ─────────────────────────────────

function libraryToTrackOffset(sqIdx: number): number | null {
  if (sqIdx >= 4 && sqIdx <= 9) return sqIdx - 4
  if (sqIdx >= 16 && sqIdx <= 21) return sqIdx - 16 + 6
  if (sqIdx === 15) return 12
  return null
}

function libraryToSafeEndOffset(sqIdx: number): number | null {
  if (sqIdx >= 10 && sqIdx <= 14) return sqIdx - 10
  return null
}

/**
 * Convert a library piece position to SVG coordinates.
 * @returns [cx, cy] centre of the piece circle
 */
export function getPieceSVGPosition(
  playerName: string,
  squareIndex: number,
  pieceIndex: number,
): [number, number] {
  // Home (0-3)
  if (squareIndex >= 0 && squareIndex <= 3) {
    return HOME_POSITIONS[playerName]?.[squareIndex] ?? [300, 300]
  }

  // Goal (22)
  if (squareIndex === 22) {
    const offsets: [number, number][] = [[-8, -8], [8, -8], [-8, 8], [8, 8]]
    const [ox, oy] = offsets[pieceIndex] ?? [0, 0]
    const [gx, gy] = cellXY(GOAL_POS[0], GOAL_POS[1])
    return [gx + 18 + ox, gy + 18 + oy]
  }

  // Main track
  const trackOff = libraryToTrackOffset(squareIndex)
  if (trackOff !== null) {
    const entry = PLAYER_ENTRY[playerName] ?? 0
    const globalIdx = (entry + trackOff) % 52
    const [col, row] = TRACK[globalIdx] ?? [7, 7]
    const [x, y] = cellXY(col, row)
    return [x + 18, y + 18]
  }

  // Safe-end
  const seOff = libraryToSafeEndOffset(squareIndex)
  if (seOff !== null) {
    const sePath = SAFE_END_PATHS[playerName] ?? SAFE_END_PATHS.a!
    const [col, row] = sePath[seOff] ?? [7, 7]
    const [x, y] = cellXY(col, row)
    return [x + 18, y + 18]
  }

  return [300, 300]
}

// ─── Piece render colours ────────────────────────────────────────────────────

export const PIECE_COLORS: Record<string, { fill: string; stroke: string }> = {
  a: { fill: '#ef4444', stroke: '#b91c1c' },
  b: { fill: '#3b82f6', stroke: '#1d4ed8' },
  c: { fill: '#22c55e', stroke: '#15803d' },
  d: { fill: '#eab308', stroke: '#a16207' },
}

/** Stacking offsets when multiple pieces share a cell */
export const STACK_OFFSETS: [number, number][] = [
  [-7, -7], [7, -7], [-7, 7], [7, 7],
  [-4, 0], [4, 0], [0, -4], [0, 4],
]
