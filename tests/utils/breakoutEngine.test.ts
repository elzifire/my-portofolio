import { describe, it, expect, beforeEach } from 'vitest'
import {
  isLevelUnlocked,
  calculateStars,
  checkNewAchievements,
  formatTime,
  computeTotalStars,
  computeHighestLevel,
  computeTotalScore,
  buildBricks,
  loadSave,
  persistSave,
} from '../../app/utils/breakoutEngine'
import { LEVELS } from '../../app/utils/breakoutLevels'
import type { LevelSave } from '../../app/utils/breakoutTypes'

describe('breakoutEngine', () => {
  // ===== isLevelUnlocked =====
  describe('isLevelUnlocked', () => {
    it('level 0 is always unlocked', () => {
      expect(isLevelUnlocked(0, {})).toBe(true)
    })

    it('level 1 is locked if level 0 not cleared', () => {
      expect(isLevelUnlocked(1, {})).toBe(false)
    })

    it('level 1 is unlocked if level 0 cleared', () => {
      expect(isLevelUnlocked(1, { 0: { stars: 1, bestScore: 100, bestTime: 30 } })).toBe(true)
    })

    it('level 5 requires level 4 cleared', () => {
      const levels: Record<number, LevelSave> = {}
      for (let i = 0; i < 4; i++) levels[i] = { stars: 1, bestScore: 100, bestTime: 30 }
      expect(isLevelUnlocked(5, levels)).toBe(false)
      levels[4] = { stars: 1, bestScore: 100, bestTime: 30 }
      expect(isLevelUnlocked(5, levels)).toBe(true)
    })

    it('level 0 unlocked even with populated save data', () => {
      const levels = { 2: { stars: 3, bestScore: 500, bestTime: 20 } }
      expect(isLevelUnlocked(0, levels)).toBe(true)
    })
  })

  // ===== calculateStars =====
  describe('calculateStars', () => {
    it('returns 1 star for basic clear (low score) on level 0', () => {
      expect(calculateStars(LEVELS[0], 0, 100, 90, 0, 0)).toBe(1)
    })

    it('returns 2 stars when score threshold met on level 0 (>= 300)', () => {
      expect(calculateStars(LEVELS[0], 0, 300, 90, 0, 0)).toBe(2)
    })

    it('returns 3 stars when time threshold met on level 0 (< 60s)', () => {
      expect(calculateStars(LEVELS[0], 0, 300, 50, 0, 0)).toBe(3)
    })

    it('level 0: high score but slow time gets 2 stars', () => {
      expect(calculateStars(LEVELS[0], 0, 500, 120, 10, 0)).toBe(2)
    })

    it('level 4 (Ice Cavern) needs no life lost for 3 stars', () => {
      expect(calculateStars(LEVELS[4], 4, 1000, 30, 5, 0)).toBe(3)
    })

    it('level 4 gets only 2 stars if lives lost', () => {
      expect(calculateStars(LEVELS[4], 4, 1000, 30, 5, 1)).toBe(2)
    })

    it('level 9 (Final Boss) needs no life lost for 3 stars', () => {
      expect(calculateStars(LEVELS[9], 9, 2000, 30, 5, 0)).toBe(3)
    })

    it('level 9 gets only 2 stars if lives lost despite high score', () => {
      expect(calculateStars(LEVELS[9], 9, 2000, 30, 5, 2)).toBe(2)
    })

    it('level 2 (Jungle) needs combo 8+ for 3 stars', () => {
      expect(calculateStars(LEVELS[2], 2, 600, 100, 8, 0)).toBe(3)
    })

    it('level 2 gets 2 stars with good score but low combo', () => {
      expect(calculateStars(LEVELS[2], 2, 600, 100, 5, 0)).toBe(2)
    })

    it('level 5 (Neon City) needs combo 10+ for 3 stars', () => {
      expect(calculateStars(LEVELS[5], 5, 900, 100, 10, 0)).toBe(3)
    })

    it('level 3 (Volcano) needs < 50s for 3 stars', () => {
      expect(calculateStars(LEVELS[3], 3, 700, 49, 5, 0)).toBe(3)
      expect(calculateStars(LEVELS[3], 3, 700, 51, 5, 0)).toBe(2)
    })
  })

  // ===== checkNewAchievements =====
  describe('checkNewAchievements', () => {
    const baseCtx = {
      clearedCount: 1,
      livesLost: 0,
      maxCombo: 3,
      elapsedSec: 45,
      totalStars: 2,
      stars: 2,
      totalPowerUps: 0,
    }

    it('always unlocks first_clear on any clear', () => {
      const result = checkNewAchievements([], baseCtx)
      expect(result).toContain('first_clear')
    })

    it('does not re-unlock existing achievements', () => {
      const result = checkNewAchievements(['first_clear'], baseCtx)
      expect(result).not.toContain('first_clear')
    })

    it('unlocks no_miss when no lives lost', () => {
      const result = checkNewAchievements([], { ...baseCtx, livesLost: 0 })
      expect(result).toContain('no_miss')
    })

    it('does not unlock no_miss when lives lost', () => {
      const result = checkNewAchievements([], { ...baseCtx, livesLost: 2 })
      expect(result).not.toContain('no_miss')
    })

    it('unlocks five_levels when 5 levels cleared', () => {
      const result = checkNewAchievements([], { ...baseCtx, clearedCount: 5 })
      expect(result).toContain('five_levels')
    })

    it('does not unlock five_levels with 4 levels', () => {
      const result = checkNewAchievements([], { ...baseCtx, clearedCount: 4 })
      expect(result).not.toContain('five_levels')
    })

    it('unlocks all_levels when 10 levels cleared', () => {
      const result = checkNewAchievements([], { ...baseCtx, clearedCount: 10 })
      expect(result).toContain('all_levels')
      expect(result).toContain('five_levels')
    })

    it('unlocks combo_10 at combo 10', () => {
      const result = checkNewAchievements([], { ...baseCtx, maxCombo: 10 })
      expect(result).toContain('combo_10')
    })

    it('does not unlock combo_10 at combo 9', () => {
      const result = checkNewAchievements([], { ...baseCtx, maxCombo: 9 })
      expect(result).not.toContain('combo_10')
    })

    it('unlocks combo_20 at combo 20 (and combo_10)', () => {
      const result = checkNewAchievements([], { ...baseCtx, maxCombo: 20 })
      expect(result).toContain('combo_20')
      expect(result).toContain('combo_10')
    })

    it('unlocks speed_demon when cleared in 30s or less', () => {
      const result = checkNewAchievements([], { ...baseCtx, elapsedSec: 30 })
      expect(result).toContain('speed_demon')
    })

    it('does not unlock speed_demon when over 30s', () => {
      const result = checkNewAchievements([], { ...baseCtx, elapsedSec: 31 })
      expect(result).not.toContain('speed_demon')
    })

    it('unlocks star_collector at 15 total stars', () => {
      const result = checkNewAchievements([], { ...baseCtx, totalStars: 15 })
      expect(result).toContain('star_collector')
    })

    it('does not unlock star_collector at 14 stars', () => {
      const result = checkNewAchievements([], { ...baseCtx, totalStars: 14 })
      expect(result).not.toContain('star_collector')
    })

    it('unlocks perfect_star at 3 stars', () => {
      const result = checkNewAchievements([], { ...baseCtx, stars: 3 })
      expect(result).toContain('perfect_star')
    })

    it('does not unlock perfect_star at 2 stars', () => {
      const result = checkNewAchievements([], { ...baseCtx, stars: 2 })
      expect(result).not.toContain('perfect_star')
    })

    it('unlocks power_hunter with 5+ power-ups', () => {
      const result = checkNewAchievements([], { ...baseCtx, totalPowerUps: 5 })
      expect(result).toContain('power_hunter')
    })

    it('does not unlock power_hunter with 4 power-ups', () => {
      const result = checkNewAchievements([], { ...baseCtx, totalPowerUps: 4 })
      expect(result).not.toContain('power_hunter')
    })

    it('can unlock multiple achievements at once', () => {
      const result = checkNewAchievements([], {
        clearedCount: 10,
        livesLost: 0,
        maxCombo: 25,
        elapsedSec: 20,
        totalStars: 30,
        stars: 3,
        totalPowerUps: 10,
      })
      expect(result).toContain('first_clear')
      expect(result).toContain('five_levels')
      expect(result).toContain('all_levels')
      expect(result).toContain('no_miss')
      expect(result).toContain('combo_10')
      expect(result).toContain('combo_20')
      expect(result).toContain('speed_demon')
      expect(result).toContain('star_collector')
      expect(result).toContain('perfect_star')
      expect(result).toContain('power_hunter')
      expect(result).toHaveLength(10)
    })

    it('skips already unlocked achievements in bulk', () => {
      const result = checkNewAchievements(['first_clear', 'no_miss', 'combo_10'], {
        clearedCount: 10,
        livesLost: 0,
        maxCombo: 25,
        elapsedSec: 20,
        totalStars: 30,
        stars: 3,
        totalPowerUps: 10,
      })
      expect(result).not.toContain('first_clear')
      expect(result).not.toContain('no_miss')
      expect(result).not.toContain('combo_10')
      expect(result).toHaveLength(7)
    })
  })

  // ===== formatTime =====
  describe('formatTime', () => {
    it('formats 0 seconds', () => {
      expect(formatTime(0)).toBe('0:00')
    })

    it('formats single digit seconds with padding', () => {
      expect(formatTime(5)).toBe('0:05')
    })

    it('formats 59 seconds', () => {
      expect(formatTime(59)).toBe('0:59')
    })

    it('formats 60 seconds as 1:00', () => {
      expect(formatTime(60)).toBe('1:00')
    })

    it('formats 125 seconds as 2:05', () => {
      expect(formatTime(125)).toBe('2:05')
    })

    it('formats large values', () => {
      expect(formatTime(3661)).toBe('61:01')
    })
  })

  // ===== computeTotalStars =====
  describe('computeTotalStars', () => {
    it('returns 0 for empty levels', () => {
      expect(computeTotalStars({})).toBe(0)
    })

    it('sums stars from all levels', () => {
      expect(computeTotalStars({
        0: { stars: 3, bestScore: 100, bestTime: 30 },
        1: { stars: 2, bestScore: 200, bestTime: 25 },
        2: { stars: 1, bestScore: 150, bestTime: 40 },
      })).toBe(6)
    })

    it('handles single level', () => {
      expect(computeTotalStars({
        5: { stars: 3, bestScore: 500, bestTime: 20 },
      })).toBe(3)
    })
  })

  // ===== computeHighestLevel =====
  describe('computeHighestLevel', () => {
    it('returns 0 for empty levels', () => {
      expect(computeHighestLevel({})).toBe(0)
    })

    it('returns highest level index + 1', () => {
      expect(computeHighestLevel({
        0: { stars: 1, bestScore: 100, bestTime: 30 },
        1: { stars: 2, bestScore: 200, bestTime: 25 },
        3: { stars: 1, bestScore: 150, bestTime: 40 },
      })).toBe(4)
    })

    it('handles non-sequential level keys', () => {
      expect(computeHighestLevel({
        7: { stars: 2, bestScore: 800, bestTime: 35 },
      })).toBe(8)
    })
  })

  // ===== computeTotalScore =====
  describe('computeTotalScore', () => {
    it('returns 0 for empty levels', () => {
      expect(computeTotalScore({})).toBe(0)
    })

    it('sums best scores from all levels', () => {
      expect(computeTotalScore({
        0: { stars: 1, bestScore: 100, bestTime: 30 },
        1: { stars: 2, bestScore: 250, bestTime: 25 },
      })).toBe(350)
    })
  })

  // ===== buildBricks =====
  describe('buildBricks', () => {
    it('creates correct number of bricks for level 0 (8x4)', () => {
      const bricks = buildBricks(LEVELS[0])
      expect(bricks).toHaveLength(8 * 4)
    })

    it('creates correct number of bricks for level 9 (10x7)', () => {
      const bricks = buildBricks(LEVELS[9])
      expect(bricks).toHaveLength(10 * 7)
    })

    it('all bricks are alive initially', () => {
      const bricks = buildBricks(LEVELS[0])
      expect(bricks.every(b => b.alive)).toBe(true)
    })

    it('all bricks have positive dimensions', () => {
      const bricks = buildBricks(LEVELS[0])
      for (const b of bricks) {
        expect(b.w).toBeGreaterThan(0)
        expect(b.h).toBe(16)
      }
    })

    it('bricks have correct y position based on row', () => {
      const bricks = buildBricks(LEVELS[0])
      const firstRowBricks = bricks.filter(b => b.y === 50) // BRICK_TOP = 50
      expect(firstRowBricks).toHaveLength(8) // 8 cols for level 0
    })

    it('level 1 (Ocean) creates indestructible bricks', () => {
      const bricks = buildBricks(LEVELS[1])
      const indBricks = bricks.filter(b => b.type === 'indestructible')
      expect(indBricks.length).toBe(2) // r=2, c=0 and c=7
    })

    it('level 2 (Jungle) creates tough bricks', () => {
      const bricks = buildBricks(LEVELS[2])
      const toughBricks = bricks.filter(b => b.type === 'tough')
      expect(toughBricks.length).toBeGreaterThan(0)
      expect(toughBricks[0].hp).toBe(2)
      expect(toughBricks[0].maxHp).toBe(2)
    })

    it('level 3 (Volcano) creates explosive bricks', () => {
      const bricks = buildBricks(LEVELS[3])
      const expBricks = bricks.filter(b => b.type === 'explosive')
      expect(expBricks.length).toBeGreaterThan(0)
    })

    it('level 5 (Neon City) gives moving property to bricks on even rows', () => {
      const bricks = buildBricks(LEVELS[5])
      const movingBricks = bricks.filter(b => b.moving)
      expect(movingBricks.length).toBeGreaterThan(0)
    })

    it('indestructible bricks are never given moving property', () => {
      const bricks = buildBricks(LEVELS[4]) // Ice Cavern has indestructible + no movingBricks
      const indMoving = bricks.filter(b => b.type === 'indestructible' && b.moving)
      expect(indMoving.length).toBe(0)
    })

    it('brick colors cycle based on row index', () => {
      const bricks = buildBricks(LEVELS[0])
      const colors = LEVELS[0].brickColors
      const row0 = bricks.filter(b => b.y === 50)
      const row1 = bricks.filter(b => b.y === 50 + 16 + 3) // BRICK_H + BRICK_PAD
      expect(row0.every(b => b.color === colors[0])).toBe(true)
      expect(row1.every(b => b.color === colors[1])).toBe(true)
    })
  })

  // ===== loadSave / persistSave =====
  describe('loadSave / persistSave', () => {
    beforeEach(() => localStorage.clear())

    it('returns empty save data when localStorage is empty', () => {
      const save = loadSave()
      expect(save).toEqual({ levels: {}, achievements: [] })
    })

    it('persists and loads save data correctly', () => {
      const data = {
        levels: { 0: { stars: 2, bestScore: 300, bestTime: 45 } },
        achievements: ['first_clear'],
      }
      persistSave(data)
      const loaded = loadSave()
      expect(loaded).toEqual(data)
    })

    it('handles corrupt localStorage data gracefully', () => {
      localStorage.setItem('breakout-adventure-v1', 'not-valid-json')
      const save = loadSave()
      expect(save).toEqual({ levels: {}, achievements: [] })
    })

    it('overwrites previous save data', () => {
      persistSave({ levels: { 0: { stars: 1, bestScore: 100, bestTime: 60 } }, achievements: [] })
      persistSave({ levels: { 0: { stars: 3, bestScore: 500, bestTime: 30 } }, achievements: ['first_clear'] })
      const loaded = loadSave()
      expect(loaded.levels[0].stars).toBe(3)
      expect(loaded.achievements).toEqual(['first_clear'])
    })
  })

  // ===== LEVELS data integrity =====
  describe('LEVELS data integrity', () => {
    it('has exactly 10 levels', () => {
      expect(LEVELS).toHaveLength(10)
    })

    it('all levels have required properties', () => {
      for (const lvl of LEVELS) {
        expect(lvl.name).toBeTruthy()
        expect(lvl.emoji).toBeTruthy()
        expect(lvl.cols).toBeGreaterThan(0)
        expect(lvl.rows).toBeGreaterThan(0)
        expect(lvl.speed).toBeGreaterThan(0)
        expect(lvl.lives).toBeGreaterThan(0)
        expect(lvl.paddleW).toBeGreaterThan(0)
        expect(lvl.brickColors.length).toBeGreaterThan(0)
        expect(lvl.bgColors).toHaveLength(2)
        expect(typeof lvl.star2).toBe('function')
        expect(typeof lvl.star3).toBe('function')
        expect(lvl.powerUpChance).toBeGreaterThan(0)
        expect(lvl.powerUpChance).toBeLessThanOrEqual(1)
      }
    })

    it('difficulty increases (speed generally increases)', () => {
      expect(LEVELS[9].speed).toBeGreaterThan(LEVELS[0].speed)
    })

    it('final level has all special mechanics', () => {
      const final = LEVELS[9]
      expect(final.movingBricks).toBe(true)
      expect(final.specialBricks).toBeDefined()
    })
  })
})
