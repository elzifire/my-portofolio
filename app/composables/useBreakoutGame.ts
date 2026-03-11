import { ref, computed, onMounted, onUnmounted, watch, nextTick, type Ref } from 'vue'
import type { Ball, Brick, Particle, FallingPowerUp, ActivePowerUp, PowerUpType, Achievement, ScreenType } from '../utils/breakoutTypes'
import { CW, CH, PADDLE_H, BALL_R, POWERUP_EMOJI, ACHIEVEMENT_DEFS } from '../utils/breakoutTypes'
import { LEVELS } from '../utils/breakoutLevels'
import {
  buildBricks, createBall, isLevelUnlocked as checkUnlocked,
  calculateStars, checkNewAchievements, formatTime,
  computeTotalStars, computeHighestLevel, computeTotalScore,
  loadSave, persistSave,
} from '../utils/breakoutEngine'

export function useBreakoutGame(canvasRef: Ref<HTMLCanvasElement | null>) {
  const { t } = useI18n()

  // ===== SAVE DATA =====
  const saveData = ref(loadSave())
  console.log('[Breakout] Initial save data loaded:', saveData.value)
  function persist() { persistSave(saveData.value); console.log('[Breakout] Save persisted:', saveData.value) }
  function getSavedLevel(idx: number) { return saveData.value.levels[idx] }
  function isLevelUnlocked(idx: number) { return checkUnlocked(idx, saveData.value.levels) }
  function isAchievementUnlocked(id: string) { return saveData.value.achievements.includes(id) }

  const unlockedAchievements = computed(() => saveData.value.achievements)
  const totalStars = computed(() => computeTotalStars(saveData.value.levels))
  const highestLevel = computed(() => computeHighestLevel(saveData.value.levels))
  const totalScore = computed(() => computeTotalScore(saveData.value.levels))

  const allAchievements = computed<Achievement[]>(() =>
    ACHIEVEMENT_DEFS.map((def) => {
      const key = 'ach' + def.id.split('_').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')
      return { ...def, title: t(`breakoutGame.${key}`), desc: t(`breakoutGame.${key}Desc`) }
    }),
  )

  // ===== SCREEN STATE =====
  const screen = ref<ScreenType>('map')
  const showResetConfirm = ref(false)
  const currentLevel = ref(0)
  const currentLevelDef = computed(() => LEVELS[currentLevel.value])

  function selectLevel(idx: number) {
    console.log('[Breakout] selectLevel called with idx:', idx)
    console.log('[Breakout] isLevelUnlocked:', isLevelUnlocked(idx))
    if (!isLevelUnlocked(idx)) return
    currentLevel.value = idx
    screen.value = 'intro'
    console.log('[Breakout] Level selected, screen set to intro')
  }

  function resetAllProgress() {
    saveData.value = { levels: {}, achievements: [] }
    persist()
    showResetConfirm.value = false
  }

  // ===== GAME STATE (reactive) =====
  const score = ref(0)
  const lives = ref(3)
  const combo = ref(0)
  const maxCombo = ref(0)
  const formattedTime = ref('0:00')
  const levelWon = ref(false)
  const earnedStars = ref(0)
  const newAchievements = ref<Achievement[]>([])
  const activePowerUps = ref<ActivePowerUp[]>([])

  // ===== GAME STATE (non-reactive) =====
  let paddleX = 0
  let paddleW = 70
  let balls: Ball[] = []
  let bricks: Brick[] = []
  let particles: Particle[] = []
  let powerUps: FallingPowerUp[] = []
  let frameId = 0
  let gameRunning = false
  let startTime = 0
  let elapsedSec = 0
  let livesLost = 0
  let totalPowerUpsCollected = 0

  // ===== LEVEL LAUNCH =====
  async function launchLevel() {
    console.log('[Breakout] launchLevel called - currentLevel:', currentLevel.value)
    const lvl = LEVELS[currentLevel.value]
    console.log('[Breakout] Level definition:', lvl?.name)
    if (!lvl) {
      console.error('[Breakout] ERROR: Level not found for index:', currentLevel.value)
      return
    }
    score.value = 0
    lives.value = lvl.lives
    combo.value = 0
    maxCombo.value = 0
    livesLost = 0
    totalPowerUpsCollected = 0
    levelWon.value = false
    earnedStars.value = 0
    newAchievements.value = []
    activePowerUps.value = []
    particles = []
    powerUps = []
    paddleW = lvl.paddleW
    paddleX = CW / 2 - paddleW / 2
    bricks = buildBricks(lvl)
    balls = [createBall(CW / 2, CH - 50, lvl.speed)]
    startTime = Date.now()
    elapsedSec = 0
    formattedTime.value = '0:00'
    screen.value = 'play'
    gameRunning = true
    
    // Wait for canvas to be available in DOM before starting loop
    await nextTick()
    // Additional delay to ensure canvas is rendered
    await new Promise(resolve => setTimeout(resolve, 50))
    
    if (canvasRef.value) {
      loop()
    } else {
      console.error('[Breakout] ERROR: Canvas still null after nextTick!')
      gameRunning = false
    }
  }

  function retryLevel() { screen.value = 'intro' }

  function goNextLevel() {
    currentLevel.value++
    screen.value = 'intro'
  }

  // ===== INPUT =====
  function onMouseMove(e: MouseEvent) {
    // console.log('[Breakout] onMouseMove called')
    const canvas = canvasRef.value
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = CW / rect.width
    paddleX = Math.max(0, Math.min(CW - paddleW, (e.clientX - rect.left) * scaleX - paddleW / 2))
  }

  function onTouchMove(e: TouchEvent) {
    const canvas = canvasRef.value
    if (!canvas || !e.touches[0]) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = CW / rect.width
    paddleX = Math.max(0, Math.min(CW - paddleW, (e.touches[0].clientX - rect.left) * scaleX - paddleW / 2))
  }

  function handleKey(e: KeyboardEvent) {
    if (screen.value !== 'play') return
    if (e.code === 'ArrowLeft') paddleX = Math.max(0, paddleX - 25)
    if (e.code === 'ArrowRight') paddleX = Math.min(CW - paddleW, paddleX + 25)
  }

  // ===== PARTICLES =====
  function spawnParticles(x: number, y: number, color: string, count: number) {
    console.log('[Breakout] spawnParticles - x:', x, 'y:', y, 'color:', color, 'count:', count)
    for (let i = 0; i < count; i++) {
      particles.push({
        x, y,
        dx: (Math.random() - 0.5) * 6,
        dy: (Math.random() - 0.5) * 6,
        life: 30 + Math.random() * 20,
        color,
        size: 2 + Math.random() * 3,
      })
    }
  }

  // ===== POWER-UPS =====
  function applyPowerUp(type: PowerUpType) {
    console.log('[Breakout] applyPowerUp - type:', type)
    totalPowerUpsCollected++
    activePowerUps.value = activePowerUps.value.filter(p => p.type !== type)

    switch (type) {
      case 'wide':
        paddleW = Math.min(CW * 0.4, paddleW + 25)
        activePowerUps.value.push({ type: 'wide', timer: 600 })
        break
      case 'life':
        lives.value++
        break
      case 'multi': {
        const newBalls = balls.flatMap(b => [
          { ...b, dx: b.dx + 1, dy: b.dy - 0.5, fire: b.fire },
          { ...b, dx: b.dx - 1, dy: b.dy - 0.5, fire: b.fire },
        ])
        balls.push(...newBalls)
        break
      }
      case 'slow':
        balls.forEach(b => { b.dx *= 0.7; b.dy *= 0.7 })
        activePowerUps.value.push({ type: 'slow', timer: 300 })
        break
      case 'fire':
        balls.forEach(b => { b.fire = true })
        activePowerUps.value.push({ type: 'fire', timer: 400 })
        break
    }
  }

  // ===== GAME LOOP =====
  function loop() {
    // console.log('[Breakout] loop() called - gameRunning:', gameRunning)
    if (!gameRunning) return
    try {
    const canvas = canvasRef.value
    if (!canvas) {
      console.error('[Breakout] ERROR: Canvas is null!')
      return
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.error('[Breakout] ERROR: Cannot get 2D context!')
      return
    }
    const lvl = LEVELS[currentLevel.value]
    if (!lvl) {
      console.error('[Breakout] ERROR: Level not found in loop!')
      return
    }

    elapsedSec = Math.floor((Date.now() - startTime) / 1000)
    formattedTime.value = formatTime(elapsedSec)

    // Tick power-ups
    activePowerUps.value = activePowerUps.value.filter(p => {
      p.timer--
      if (p.timer <= 0) {
        if (p.type === 'wide') paddleW = lvl.paddleW
        if (p.type === 'fire') balls.forEach(b => { b.fire = false })
        return false
      }
      return true
    })

    // Move bricks
    if (lvl.movingBricks) {
      for (const b of bricks) {
        if (!b.alive || !b.moving) continue
        b.x += b.moving.dx
        if (b.x <= 0 || b.x + b.w >= CW) b.moving.dx *= -1
      }
    }

    // Move & catch power-ups
    powerUps = powerUps.filter(pu => {
      pu.y += pu.dy
      if (pu.y + 10 >= CH - 30 - PADDLE_H && pu.y <= CH - 30 && pu.x >= paddleX && pu.x <= paddleX + paddleW) {
        applyPowerUp(pu.type)
        spawnParticles(pu.x, pu.y, '#ffffff', 8)
        return false
      }
      return pu.y < CH
    })

    // Move balls
    const deadBalls: number[] = []
    for (let bi = 0; bi < balls.length; bi++) {
      const ball = balls[bi]
      ball.x += ball.dx
      ball.y += ball.dy

      if (ball.x - BALL_R < 0) { ball.x = BALL_R; ball.dx = Math.abs(ball.dx) }
      if (ball.x + BALL_R > CW) { ball.x = CW - BALL_R; ball.dx = -Math.abs(ball.dx) }
      if (ball.y - BALL_R < 0) { ball.y = BALL_R; ball.dy = Math.abs(ball.dy) }

      // Paddle collision
      const py = CH - 30 - PADDLE_H
      if (ball.dy > 0 && ball.y + BALL_R >= py && ball.y + BALL_R <= py + PADDLE_H + 4 && ball.x >= paddleX && ball.x <= paddleX + paddleW) {
        ball.dy = -Math.abs(ball.dy)
        ball.dx += ((ball.x - paddleX) / paddleW - 0.5) * 2.5
        const spd = Math.hypot(ball.dx, ball.dy)
        const maxSpd = lvl.speed + 2
        if (spd > maxSpd) { ball.dx = (ball.dx / spd) * maxSpd; ball.dy = (ball.dy / spd) * maxSpd }
      }

      if (ball.y > CH) deadBalls.push(bi)

      // Brick collisions
      for (const brick of bricks) {
        if (!brick.alive) continue
        if (ball.x + BALL_R > brick.x && ball.x - BALL_R < brick.x + brick.w && ball.y + BALL_R > brick.y && ball.y - BALL_R < brick.y + brick.h) {
          if (brick.type === 'indestructible') {
            if (!ball.fire) { ball.dy = -ball.dy; spawnParticles(ball.x, ball.y, '#888', 3) }
            else { brick.alive = false; spawnParticles(brick.x + brick.w / 2, brick.y + brick.h / 2, brick.color, 10) }
            break
          }
          brick.hp--
          if (brick.hp <= 0) {
            brick.alive = false
            combo.value++
            if (combo.value > maxCombo.value) maxCombo.value = combo.value
            score.value += 10 + Math.floor(combo.value / 3) * 5
            spawnParticles(brick.x + brick.w / 2, brick.y + brick.h / 2, brick.color, 8)
            if (brick.powerUp) powerUps.push({ x: brick.x + brick.w / 2, y: brick.y + brick.h / 2, dy: 1.5, type: brick.powerUp })
            if (brick.type === 'explosive') {
              spawnParticles(brick.x + brick.w / 2, brick.y + brick.h / 2, '#ff5722', 20)
              for (const nb of bricks) {
                if (!nb.alive || nb === brick || nb.type === 'indestructible') continue
                if (Math.hypot(nb.x - brick.x, nb.y - brick.y) < 60) {
                  nb.hp--
                  if (nb.hp <= 0) { nb.alive = false; score.value += 5; spawnParticles(nb.x + nb.w / 2, nb.y + nb.h / 2, nb.color, 5) }
                }
              }
            }
          } else { spawnParticles(ball.x, ball.y, brick.color, 3) }
          if (!ball.fire) ball.dy = -ball.dy
          break
        }
      }
    }

    for (let i = deadBalls.length - 1; i >= 0; i--) balls.splice(deadBalls[i], 1)
    console.log('[Breakout] Balls remaining:', balls.length, 'Lives:', lives.value)
    if (balls.length === 0) {
      lives.value--; livesLost++; combo.value = 0
      if (lives.value <= 0) { endLevel(false); return }
      balls = [createBall(CW / 2, CH - 50, lvl.speed)]
    }

    if (bricks.filter(b => b.type !== 'indestructible').every(b => !b.alive)) { 
      console.log('[Breakout] ALL BRICKS CLEARED - Level Won!')
      endLevel(true); return 
    }

    particles = particles.filter(p => { p.x += p.dx; p.y += p.dy; p.life--; p.dy += 0.1; return p.life > 0 })

    draw(ctx)
    frameId = requestAnimationFrame(loop)
    } catch (e) {
      console.error('[Breakout] ERROR in game loop:', e)
      gameRunning = false
    }
  }

  // ===== END LEVEL =====
  function endLevel(won: boolean) {
    console.log('[Breakout] endLevel() called - won:', won)
    gameRunning = false
    cancelAnimationFrame(frameId)
    levelWon.value = won

    if (won) {
      const lvl = LEVELS[currentLevel.value]
      const stars = calculateStars(lvl, currentLevel.value, score.value, elapsedSec, maxCombo.value, livesLost)
      earnedStars.value = stars

      const prev = saveData.value.levels[currentLevel.value]
      saveData.value.levels[currentLevel.value] = {
        stars: Math.max(stars, prev?.stars || 0),
        bestScore: Math.max(score.value, prev?.bestScore || 0),
        bestTime: prev ? Math.min(elapsedSec, prev.bestTime) : elapsedSec,
      }

      const newAchIds = checkNewAchievements(saveData.value.achievements, {
        clearedCount: Object.keys(saveData.value.levels).length,
        livesLost,
        maxCombo: maxCombo.value,
        elapsedSec,
        totalStars: totalStars.value,
        stars,
        totalPowerUps: totalPowerUpsCollected,
      })
      saveData.value.achievements.push(...newAchIds)
      newAchievements.value = newAchIds
        .map(id => allAchievements.value.find(a => a.id === id)!)
        .filter(Boolean)

      persist()
    }
    screen.value = 'complete'
  }

  // ===== DRAW =====
  function draw(ctx: CanvasRenderingContext2D) {
    const lvl = LEVELS[currentLevel.value]
    if (!lvl) {
      console.error('[Breakout] ERROR: No level found in draw()!')
      return
    }

    // BG gradient
    const grad = ctx.createLinearGradient(0, 0, 0, CH)
    grad.addColorStop(0, lvl.bgColors[0])
    grad.addColorStop(1, lvl.bgColors[1])
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, CW, CH)

    // Level name
    ctx.fillStyle = 'rgba(255,255,255,0.08)'
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${lvl.emoji} ${lvl.name} — Lv.${currentLevel.value + 1}`, CW / 2, 20)

    // Bricks
    for (const b of bricks) {
      if (!b.alive) continue
      if (currentLevel.value === 6) {
        ctx.globalAlpha = b.type === 'normal' ? 0.5 + 0.5 * Math.sin(Date.now() / 500 + b.x * 0.1) : 1
      }
      ctx.fillStyle = b.type === 'indestructible' ? '#546e7a'
        : b.type === 'explosive' ? `rgba(255,87,34,${0.8 + 0.2 * Math.sin(Date.now() / 200)})` : b.color
      const rr = 3
      ctx.beginPath()
      ctx.moveTo(b.x + rr, b.y); ctx.lineTo(b.x + b.w - rr, b.y)
      ctx.quadraticCurveTo(b.x + b.w, b.y, b.x + b.w, b.y + rr)
      ctx.lineTo(b.x + b.w, b.y + b.h - rr)
      ctx.quadraticCurveTo(b.x + b.w, b.y + b.h, b.x + b.w - rr, b.y + b.h)
      ctx.lineTo(b.x + rr, b.y + b.h)
      ctx.quadraticCurveTo(b.x, b.y + b.h, b.x, b.y + b.h - rr)
      ctx.lineTo(b.x, b.y + rr)
      ctx.quadraticCurveTo(b.x, b.y, b.x + rr, b.y)
      ctx.fill()
      if (b.type === 'tough' && b.hp > 1) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center'
        ctx.fillText(`${b.hp}`, b.x + b.w / 2, b.y + b.h / 2 + 3)
      }
      if (b.type === 'indestructible') {
        ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1
        for (let i = 0; i < b.w; i += 6) { ctx.beginPath(); ctx.moveTo(b.x + i, b.y); ctx.lineTo(b.x + i, b.y + b.h); ctx.stroke() }
      }
      if (b.powerUp) { ctx.font = '9px sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.fillText(POWERUP_EMOJI[b.powerUp], b.x + b.w / 2, b.y + b.h / 2 + 3) }
      ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(b.x + 2, b.y + 1, b.w - 4, b.h / 3)
      ctx.globalAlpha = 1
    }

    // Power-ups falling
    ctx.font = '16px sans-serif'; ctx.textAlign = 'center'
    for (const pu of powerUps) ctx.fillText(POWERUP_EMOJI[pu.type], pu.x, pu.y + 6)

    // Paddle
    const isFireActive = activePowerUps.value.some(p => p.type === 'fire')
    const pGrad = ctx.createLinearGradient(paddleX, 0, paddleX + paddleW, 0)
    pGrad.addColorStop(0, isFireActive ? '#ff5722' : '#42a5f5')
    pGrad.addColorStop(0.5, isFireActive ? '#ff8a65' : '#90caf9')
    pGrad.addColorStop(1, isFireActive ? '#ff5722' : '#42a5f5')
    ctx.fillStyle = pGrad
    const py = CH - 30 - PADDLE_H; const pr = 6
    ctx.beginPath()
    ctx.moveTo(paddleX + pr, py); ctx.lineTo(paddleX + paddleW - pr, py)
    ctx.quadraticCurveTo(paddleX + paddleW, py, paddleX + paddleW, py + pr)
    ctx.lineTo(paddleX + paddleW, py + PADDLE_H - pr)
    ctx.quadraticCurveTo(paddleX + paddleW, py + PADDLE_H, paddleX + paddleW - pr, py + PADDLE_H)
    ctx.lineTo(paddleX + pr, py + PADDLE_H)
    ctx.quadraticCurveTo(paddleX, py + PADDLE_H, paddleX, py + PADDLE_H - pr)
    ctx.lineTo(paddleX, py + pr)
    ctx.quadraticCurveTo(paddleX, py, paddleX + pr, py)
    ctx.fill()

    // Balls
    for (const ball of balls) {
      ctx.fillStyle = ball.fire ? '#ff5722' : '#fff'
      ctx.shadowColor = ball.fire ? '#ff5722' : '#42a5f5'
      ctx.shadowBlur = ball.fire ? 15 : 8
      ctx.beginPath(); ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2); ctx.fill()
      if (ball.fire) {
        ctx.fillStyle = 'rgba(255,87,34,0.4)'; ctx.beginPath()
        ctx.arc(ball.x - ball.dx * 2, ball.y - ball.dy * 2, BALL_R * 0.7, 0, Math.PI * 2); ctx.fill()
      }
    }
    ctx.shadowBlur = 0

    // Particles
    for (const p of particles) {
      ctx.globalAlpha = p.life / 50; ctx.fillStyle = p.color
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
    }
    ctx.globalAlpha = 1

    // Combo text
    if (combo.value >= 3) {
      ctx.fillStyle = `rgba(255,255,100,${0.5 + 0.5 * Math.sin(Date.now() / 100)})`
      ctx.font = `bold ${16 + combo.value}px sans-serif`; ctx.textAlign = 'center'
      ctx.fillText(`${combo.value}x COMBO!`, CW / 2, CH - 60)
    }
  }

  // ===== LIFECYCLE =====
  onMounted(() => window.addEventListener('keydown', handleKey))
  onUnmounted(() => { gameRunning = false; cancelAnimationFrame(frameId); window.removeEventListener('keydown', handleKey) })
  watch(screen, (val) => { if (val !== 'play') { gameRunning = false; cancelAnimationFrame(frameId) } })

  return {
    LEVELS, CW, CH, POWERUP_EMOJI,
    screen, showResetConfirm, currentLevel, currentLevelDef,
    saveData, totalStars, highestLevel, totalScore, unlockedAchievements, allAchievements,
    score, lives, combo, maxCombo, formattedTime, levelWon, earnedStars, newAchievements, activePowerUps,
    selectLevel, getSavedLevel, isLevelUnlocked, isAchievementUnlocked,
    resetAllProgress, launchLevel, retryLevel, goNextLevel,
    onMouseMove, onTouchMove,
  }
}
