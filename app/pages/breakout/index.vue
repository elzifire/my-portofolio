<template>
  <div class="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-6 px-4">
    <div class="max-w-lg mx-auto">
      <!-- Header -->
      <div class="text-center mb-6">
        <NuxtLink to="/games" class="inline-block mb-4 text-gray-400 hover:text-white transition-colors text-sm">
          &larr; {{ $t('games.backToGames') }}
        </NuxtLink>
        <h1 class="text-4xl font-bold text-white mb-1 flex items-center justify-center gap-3">
          <span class="text-3xl">🧱</span> {{ $t('breakoutGame.title') }}
        </h1>
        <p class="text-gray-400 text-sm">{{ $t('breakoutGame.subtitle') }}</p>
      </div>

      <!-- Game Area -->
      <div class="glass-card rounded-2xl p-3 sm:p-4 relative">
        <!-- Stats -->
        <div class="flex justify-center gap-4 mb-3">
          <div class="glass-card rounded-xl px-5 py-2 text-center">
            <span class="text-xl font-bold text-yellow-400">{{ score }}</span>
            <span class="text-xs text-gray-400 ml-2">{{ $t('breakoutGame.score') }}</span>
          </div>
          <div class="glass-card rounded-xl px-5 py-2 text-center">
            <span class="text-xl font-bold text-red-400">{{ lives }}</span>
            <span class="text-xs text-gray-400 ml-2">{{ $t('breakoutGame.lives') }}</span>
          </div>
          <div class="glass-card rounded-xl px-5 py-2 text-center">
            <span class="text-xl font-bold text-green-400">{{ level }}</span>
            <span class="text-xs text-gray-400 ml-2">{{ $t('breakoutGame.level') }}</span>
          </div>
        </div>

        <canvas
          ref="canvasRef"
          :width="CW"
          :height="CH"
          @mousemove="onMouseMove"
          @touchmove.prevent="onTouchMove"
          @click="handleClick"
          class="mx-auto block rounded-xl cursor-pointer border border-gray-700"
          :style="{ maxWidth: '100%', height: 'auto' }"
        />

        <!-- Overlays -->
        <div v-if="!started || gameOver || won" class="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
          <div class="text-center p-6">
            <div v-if="won" class="mb-4">
              <div class="text-5xl mb-2">🎉</div>
              <h2 class="text-2xl font-bold text-white mb-1">{{ $t('breakoutGame.youWin') }}</h2>
              <p class="text-gray-300">{{ $t('breakoutGame.score') }}: {{ score }}</p>
            </div>
            <div v-else-if="gameOver" class="mb-4">
              <div class="text-5xl mb-2">💥</div>
              <h2 class="text-2xl font-bold text-white mb-1">{{ $t('breakoutGame.gameOver') }}</h2>
              <p class="text-gray-300">{{ $t('breakoutGame.score') }}: {{ score }}</p>
            </div>
            <div v-else class="mb-4">
              <div class="text-5xl mb-3">🧱</div>
            </div>
            <button
              @click="startGame"
              class="px-6 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
            >
              {{ gameOver || won ? $t('breakoutGame.playAgain') : $t('breakoutGame.start') }}
            </button>
          </div>
        </div>
      </div>

      <p class="text-center text-gray-500 text-xs mt-4">{{ $t('breakoutGame.instructions') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const CW = 360
const CH = 480
const PADDLE_W = 70
const PADDLE_H = 12
const BALL_R = 6
const BRICK_ROWS = 6
const BRICK_COLS = 8
const BRICK_H = 18
const BRICK_PAD = 4
const BRICK_TOP = 40

const BRICK_COLORS = ['#ef5350', '#ff7043', '#ffca28', '#66bb6a', '#42a5f5', '#ab47bc']

const canvasRef = ref<HTMLCanvasElement | null>(null)
const score = ref(0)
const lives = ref(3)
const level = ref(1)
const started = ref(false)
const gameOver = ref(false)
const won = ref(false)

let paddleX = CW / 2 - PADDLE_W / 2
let ballX = CW / 2
let ballY = CH - 40
let ballDX = 3
let ballDY = -3
let bricks: { x: number; y: number; w: number; color: string; alive: boolean }[] = []
let frameId = 0
let paused = false

function buildBricks() {
  bricks = []
  const brickW = (CW - (BRICK_COLS + 1) * BRICK_PAD) / BRICK_COLS
  for (let r = 0; r < BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      bricks.push({
        x: BRICK_PAD + c * (brickW + BRICK_PAD),
        y: BRICK_TOP + r * (BRICK_H + BRICK_PAD),
        w: brickW,
        color: BRICK_COLORS[r % BRICK_COLORS.length],
        alive: true,
      })
    }
  }
}

function resetBall() {
  ballX = CW / 2
  ballY = CH - 40
  const speed = 3 + level.value * 0.3
  const angle = (Math.random() * 0.8 + 0.6) * (Math.random() > 0.5 ? 1 : -1)
  ballDX = speed * Math.sin(angle)
  ballDY = -speed * Math.cos(angle)
}

function startGame() {
  score.value = 0
  lives.value = 3
  level.value = 1
  gameOver.value = false
  won.value = false
  started.value = true
  paused = false
  paddleX = CW / 2 - PADDLE_W / 2
  buildBricks()
  resetBall()
  loop()
}

function handleClick() {
  if (!started.value && !gameOver.value && !won.value) startGame()
}

function onMouseMove(e: MouseEvent) {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const scaleX = CW / rect.width
  const mx = (e.clientX - rect.left) * scaleX
  paddleX = Math.max(0, Math.min(CW - PADDLE_W, mx - PADDLE_W / 2))
}

function onTouchMove(e: TouchEvent) {
  const canvas = canvasRef.value
  if (!canvas || !e.touches[0]) return
  const rect = canvas.getBoundingClientRect()
  const scaleX = CW / rect.width
  const mx = (e.touches[0].clientX - rect.left) * scaleX
  paddleX = Math.max(0, Math.min(CW - PADDLE_W, mx - PADDLE_W / 2))
}

function loop() {
  if (!started.value || paused) return
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Update ball
  ballX += ballDX
  ballY += ballDY

  // Wall collisions
  if (ballX - BALL_R < 0) { ballX = BALL_R; ballDX = Math.abs(ballDX) }
  if (ballX + BALL_R > CW) { ballX = CW - BALL_R; ballDX = -Math.abs(ballDX) }
  if (ballY - BALL_R < 0) { ballY = BALL_R; ballDY = Math.abs(ballDY) }

  // Paddle collision
  if (
    ballDY > 0 &&
    ballY + BALL_R >= CH - 25 - PADDLE_H &&
    ballY + BALL_R <= CH - 25 &&
    ballX >= paddleX &&
    ballX <= paddleX + PADDLE_W
  ) {
    ballDY = -Math.abs(ballDY)
    // Angle based on hit position
    const hitPos = (ballX - paddleX) / PADDLE_W - 0.5
    ballDX += hitPos * 2
    // Clamp speed
    const spd = Math.sqrt(ballDX * ballDX + ballDY * ballDY)
    const maxSpd = 5 + level.value * 0.5
    if (spd > maxSpd) {
      ballDX = (ballDX / spd) * maxSpd
      ballDY = (ballDY / spd) * maxSpd
    }
  }

  // Ball out of bounds
  if (ballY > CH) {
    lives.value--
    if (lives.value <= 0) {
      gameOver.value = true
      started.value = false
      cancelAnimationFrame(frameId)
      draw(ctx)
      return
    }
    resetBall()
  }

  // Brick collisions
  for (const b of bricks) {
    if (!b.alive) continue
    if (
      ballX + BALL_R > b.x &&
      ballX - BALL_R < b.x + b.w &&
      ballY + BALL_R > b.y &&
      ballY - BALL_R < b.y + BRICK_H
    ) {
      b.alive = false
      score.value += 10
      ballDY = -ballDY
      break
    }
  }

  // Check level clear
  if (bricks.every(b => !b.alive)) {
    if (level.value >= 3) {
      won.value = true
      started.value = false
      cancelAnimationFrame(frameId)
      draw(ctx)
      return
    }
    level.value++
    buildBricks()
    resetBall()
  }

  draw(ctx)
  frameId = requestAnimationFrame(loop)
}

function draw(ctx: CanvasRenderingContext2D) {
  // BG
  const grad = ctx.createLinearGradient(0, 0, 0, CH)
  grad.addColorStop(0, '#0d1117')
  grad.addColorStop(1, '#161b22')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, CW, CH)

  // Bricks
  for (const b of bricks) {
    if (!b.alive) continue
    ctx.fillStyle = b.color
    ctx.beginPath()
    const r = 4
    ctx.moveTo(b.x + r, b.y)
    ctx.lineTo(b.x + b.w - r, b.y)
    ctx.quadraticCurveTo(b.x + b.w, b.y, b.x + b.w, b.y + r)
    ctx.lineTo(b.x + b.w, b.y + BRICK_H - r)
    ctx.quadraticCurveTo(b.x + b.w, b.y + BRICK_H, b.x + b.w - r, b.y + BRICK_H)
    ctx.lineTo(b.x + r, b.y + BRICK_H)
    ctx.quadraticCurveTo(b.x, b.y + BRICK_H, b.x, b.y + BRICK_H - r)
    ctx.lineTo(b.x, b.y + r)
    ctx.quadraticCurveTo(b.x, b.y, b.x + r, b.y)
    ctx.fill()

    // Shine
    ctx.fillStyle = 'rgba(255,255,255,0.2)'
    ctx.fillRect(b.x + 2, b.y + 2, b.w - 4, BRICK_H / 3)
  }

  // Paddle
  const pGrad = ctx.createLinearGradient(paddleX, 0, paddleX + PADDLE_W, 0)
  pGrad.addColorStop(0, '#42a5f5')
  pGrad.addColorStop(0.5, '#90caf9')
  pGrad.addColorStop(1, '#42a5f5')
  ctx.fillStyle = pGrad
  ctx.beginPath()
  const pr = 6
  const py = CH - 25 - PADDLE_H
  ctx.moveTo(paddleX + pr, py)
  ctx.lineTo(paddleX + PADDLE_W - pr, py)
  ctx.quadraticCurveTo(paddleX + PADDLE_W, py, paddleX + PADDLE_W, py + pr)
  ctx.lineTo(paddleX + PADDLE_W, py + PADDLE_H - pr)
  ctx.quadraticCurveTo(paddleX + PADDLE_W, py + PADDLE_H, paddleX + PADDLE_W - pr, py + PADDLE_H)
  ctx.lineTo(paddleX + pr, py + PADDLE_H)
  ctx.quadraticCurveTo(paddleX, py + PADDLE_H, paddleX, py + PADDLE_H - pr)
  ctx.lineTo(paddleX, py + pr)
  ctx.quadraticCurveTo(paddleX, py, paddleX + pr, py)
  ctx.fill()

  // Ball
  ctx.fillStyle = '#ffffff'
  ctx.shadowColor = '#42a5f5'
  ctx.shadowBlur = 10
  ctx.beginPath()
  ctx.arc(ballX, ballY, BALL_R, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0
}

function handleKey(e: KeyboardEvent) {
  if (e.code === 'ArrowLeft') paddleX = Math.max(0, paddleX - 20)
  if (e.code === 'ArrowRight') paddleX = Math.min(CW - PADDLE_W, paddleX + 20)
}

onMounted(() => {
  window.addEventListener('keydown', handleKey)
  const canvas = canvasRef.value
  if (canvas) {
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 0, CH)
      grad.addColorStop(0, '#0d1117')
      grad.addColorStop(1, '#161b22')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, CW, CH)
    }
  }
})

onUnmounted(() => {
  started.value = false
  cancelAnimationFrame(frameId)
  window.removeEventListener('keydown', handleKey)
})
</script>
