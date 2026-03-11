export const CW = 380
export const CH = 520
export const PADDLE_H = 12
export const BALL_R = 6
export const BRICK_H = 16
export const BRICK_PAD = 3
export const BRICK_TOP = 50
export const STORAGE_KEY = 'breakout-adventure-v1'

export type PowerUpType = 'wide' | 'life' | 'multi' | 'slow' | 'fire'
export type BrickType = 'normal' | 'tough' | 'indestructible' | 'explosive'
export type ScreenType = 'map' | 'intro' | 'play' | 'complete'

export const POWERUP_TYPES: PowerUpType[] = ['wide', 'life', 'multi', 'slow', 'fire']
export const POWERUP_EMOJI: Record<PowerUpType, string> = {
  wide: '📏', life: '❤️', multi: '🔮', slow: '🐢', fire: '🔥',
}

export interface Brick {
  x: number; y: number; w: number; h: number
  color: string; alive: boolean
  type: BrickType; hp: number; maxHp: number
  powerUp?: PowerUpType
  moving?: { dx: number }
}

export interface Ball {
  x: number; y: number; dx: number; dy: number; fire: boolean
}

export interface Particle {
  x: number; y: number; dx: number; dy: number
  life: number; color: string; size: number
}

export interface FallingPowerUp {
  x: number; y: number; dy: number; type: PowerUpType
}

export interface ActivePowerUp {
  type: PowerUpType; timer: number
}

export interface LevelDef {
  name: string; emoji: string; desc: string; accent: string
  cols: number; rows: number
  speed: number; lives: number; paddleW: number
  star2Label: string; star3Label: string
  star2: (s: number, t: number, c: number) => boolean
  star3: (s: number, t: number, c: number) => boolean
  bgColors: [string, string]
  brickColors: string[]
  specialBricks?: (r: number, c: number, rows: number, cols: number) => { type: BrickType; hp: number } | null
  movingBricks?: boolean
  powerUpChance: number
}

export interface LevelSave {
  stars: number; bestScore: number; bestTime: number
}

export interface SaveData {
  levels: Record<number, LevelSave>; achievements: string[]
}

export interface AchievementDef {
  id: string; emoji: string
}

export interface Achievement {
  id: string; emoji: string; title: string; desc: string
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  { id: 'first_clear', emoji: '🎯' },
  { id: 'five_levels', emoji: '🗺️' },
  { id: 'all_levels', emoji: '👑' },
  { id: 'no_miss', emoji: '🛡️' },
  { id: 'combo_10', emoji: '🔥' },
  { id: 'combo_20', emoji: '💥' },
  { id: 'speed_demon', emoji: '⚡' },
  { id: 'star_collector', emoji: '🌟' },
  { id: 'perfect_star', emoji: '💎' },
  { id: 'power_hunter', emoji: '🎁' },
]
