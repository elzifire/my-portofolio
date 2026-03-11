import type { Brick, Ball, LevelDef, LevelSave, SaveData } from './breakoutTypes'
import { CW, BRICK_H, BRICK_PAD, BRICK_TOP, STORAGE_KEY, POWERUP_TYPES } from './breakoutTypes'

export function buildBricks(lvl: LevelDef): Brick[] {
  console.log('[BreakoutEngine] buildBricks called for level:', lvl.name)
  const bricks: Brick[] = []
  const brickW = (CW - (lvl.cols + 1) * BRICK_PAD) / lvl.cols

  for (let r = 0; r < lvl.rows; r++) {
    for (let c = 0; c < lvl.cols; c++) {
      let type: Brick['type'] = 'normal'
      let hp = 1
      if (lvl.specialBricks) {
        const special = lvl.specialBricks(r, c, lvl.rows, lvl.cols)
        if (special) { type = special.type; hp = special.hp }
      }
      const brick: Brick = {
        x: BRICK_PAD + c * (brickW + BRICK_PAD),
        y: BRICK_TOP + r * (BRICK_H + BRICK_PAD),
        w: brickW, h: BRICK_H,
        color: lvl.brickColors[r % lvl.brickColors.length],
        alive: true, type, hp, maxHp: hp,
      }
      if (type === 'normal' && Math.random() < lvl.powerUpChance) {
        brick.powerUp = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)]
      }
      if (lvl.movingBricks && r % 2 === 0 && type !== 'indestructible') {
        brick.moving = { dx: (r % 4 === 0 ? 0.5 : -0.5) }
      }
      bricks.push(brick)
    }
  }
  return bricks
}

export function createBall(cx: number, cy: number, speed: number): Ball {
  console.log('[BreakoutEngine] createBall - cx:', cx, 'cy:', cy, 'speed:', speed)
  const angle = (Math.random() * 0.8 + 0.6) * (Math.random() > 0.5 ? 1 : -1)
  return { x: cx, y: cy, dx: speed * Math.sin(angle), dy: -speed * Math.cos(angle), fire: false }
}

export function isLevelUnlocked(idx: number, levels: Record<number, LevelSave>): boolean {
  console.log('[BreakoutEngine] isLevelUnlocked - idx:', idx, 'levels:', levels)
  if (idx === 0) return true
  return !!levels[idx - 1]
}

export function calculateStars(
  lvl: LevelDef, levelIdx: number,
  score: number, elapsedSec: number, maxCombo: number, livesLost: number,
): number {
  let stars = 1
  if (lvl.star2(score, elapsedSec, maxCombo)) stars = 2
  const isNoLossLevel = levelIdx === 4 || levelIdx === 9
  if (isNoLossLevel) {
    if (livesLost === 0) stars = 3
  } else if (lvl.star3(score, elapsedSec, maxCombo)) {
    stars = 3
  }
  return stars
}

export interface AchievementContext {
  clearedCount: number
  livesLost: number
  maxCombo: number
  elapsedSec: number
  totalStars: number
  stars: number
  totalPowerUps: number
}

export function checkNewAchievements(existing: string[], ctx: AchievementContext): string[] {
  const newIds: string[] = []
  function tryUnlock(id: string) {
    if (!existing.includes(id) && !newIds.includes(id)) newIds.push(id)
  }
  tryUnlock('first_clear')
  if (ctx.clearedCount >= 5) tryUnlock('five_levels')
  if (ctx.clearedCount >= 10) tryUnlock('all_levels')
  if (ctx.livesLost === 0) tryUnlock('no_miss')
  if (ctx.maxCombo >= 10) tryUnlock('combo_10')
  if (ctx.maxCombo >= 20) tryUnlock('combo_20')
  if (ctx.elapsedSec <= 30) tryUnlock('speed_demon')
  if (ctx.totalStars >= 15) tryUnlock('star_collector')
  if (ctx.stars === 3) tryUnlock('perfect_star')
  if (ctx.totalPowerUps >= 5) tryUnlock('power_hunter')
  return newIds
}

export function formatTime(sec: number): string {
  return `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`
}

export function computeTotalStars(levels: Record<number, LevelSave>): number {
  return Object.values(levels).reduce((sum, l) => sum + l.stars, 0)
}

export function computeHighestLevel(levels: Record<number, LevelSave>): number {
  const keys = Object.keys(levels).map(Number)
  return keys.length ? Math.max(...keys) + 1 : 0
}

export function computeTotalScore(levels: Record<number, LevelSave>): number {
  return Object.values(levels).reduce((sum, l) => sum + l.bestScore, 0)
}

export function loadSave(): SaveData {
  console.log('[BreakoutEngine] loadSave() called')
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    console.log('[BreakoutEngine] Raw save data:', raw)
    if (raw) return JSON.parse(raw)
  } catch (e) { 
    console.error('[BreakoutEngine] Error loading save:', e)
  }
  return { levels: {}, achievements: [] }
}

export function persistSave(data: SaveData): void {
  console.log('[BreakoutEngine] persistSave called with:', JSON.stringify(data))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
