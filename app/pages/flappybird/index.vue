<template>
  <div class="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-6 px-4">
    <div class="max-w-lg mx-auto">
      <!-- Header -->
      <div class="text-center mb-6">
        <NuxtLink to="/games" class="inline-block mb-4 text-gray-400 hover:text-white transition-colors text-sm">
          &larr; {{ $t('games.backToGames') }}
        </NuxtLink>
        <h1 class="text-4xl font-bold text-white mb-1 flex items-center justify-center gap-3">
          <span class="text-3xl">🐦</span> {{ $t('flappyBirdGame.title') }}
        </h1>
        <p class="text-gray-400 text-sm">{{ $t('flappyBirdGame.subtitle') }}</p>
      </div>

      <!-- Game Area -->
      <div class="glass-card rounded-2xl p-3 sm:p-4 relative">
        <!-- Score display during game -->
        <div class="flex justify-center gap-4 mb-3">
          <div class="glass-card rounded-xl px-5 py-2 text-center">
            <span class="text-xl font-bold text-yellow-400">{{ score }}</span>
            <span class="text-xs text-gray-400 ml-2">{{ $t('flappyBirdGame.score') }}</span>
          </div>
          <div class="glass-card rounded-xl px-5 py-2 text-center">
            <span class="text-xl font-bold text-blue-400">{{ highScore }}</span>
            <span class="text-xs text-gray-400 ml-2">{{ $t('flappyBirdGame.best') }}</span>
          </div>
        </div>

        <canvas
          ref="canvasRef"
          :width="CANVAS_W"
          :height="CANVAS_H"
          @click="handleTap"
          @touchstart.prevent="handleTap"
          class="mx-auto block rounded-xl cursor-pointer border border-gray-700"
          :style="{ maxWidth: '100%', height: 'auto' }"
        />

        <!-- Start / Game Over overlay -->
        <div v-if="!playing" class="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
          <div class="text-center p-6">
            <div v-if="gameOver" class="mb-4">
              <div class="text-4xl mb-2">😵</div>
              <h2 class="text-2xl font-bold text-white mb-1">{{ $t('flappyBirdGame.gameOver') }}</h2>
              <p class="text-gray-300">{{ $t('flappyBirdGame.score') }}: {{ score }}</p>
            </div>
            <div v-else class="mb-4">
              <div class="text-5xl mb-3">🐦</div>
            </div>
            <button
              @click="startGame"
              class="px-6 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
            >
              {{ gameOver ? $t('flappyBirdGame.playAgain') : $t('flappyBirdGame.tapToStart') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <p class="text-center text-gray-500 text-xs mt-4">{{ $t('flappyBirdGame.instructions') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const CANVAS_W = 320
const CANVAS_H = 480
const GRAVITY = 0.35
const JUMP_VEL = -6.5
const PIPE_W = 48
const PIPE_GAP = 130
const PIPE_SPEED = 2.2
const BIRD_SIZE = 20

const canvasRef = ref<HTMLCanvasElement | null>(null)
const score = ref(0)
const highScore = ref(0)
const playing = ref(false)
const gameOver = ref(false)

let birdY = 0
let birdVel = 0
let pipes: { x: number; topH: number; scored: boolean }[] = []
let frameId = 0
let frameCount = 0

function resetGame() {
  birdY = CANVAS_H / 2 - BIRD_SIZE / 2
  birdVel = 0
  pipes = []
  frameCount = 0
  score.value = 0
  gameOver.value = false
}

function startGame() {
  resetGame()
  playing.value = true
  loop()
}

function handleTap() {
  if (!playing.value) return
  birdVel = JUMP_VEL
}

function handleKey(e: KeyboardEvent) {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault()
    if (playing.value) birdVel = JUMP_VEL
  }
}

function spawnPipe() {
  const minTop = 60
  const maxTop = CANVAS_H - PIPE_GAP - 60
  const topH = Math.floor(Math.random() * (maxTop - minTop)) + minTop
  pipes.push({ x: CANVAS_W, topH, scored: false })
}

function loop() {
  if (!playing.value) return
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Update
  birdVel += GRAVITY
  birdY += birdVel
  frameCount++

  // Spawn pipes every ~90 frames
  if (frameCount % 90 === 0) spawnPipe()

  // Move pipes
  for (const p of pipes) {
    p.x -= PIPE_SPEED
    // Score
    if (!p.scored && p.x + PIPE_W < 60) {
      p.scored = true
      score.value++
    }
  }
  pipes = pipes.filter(p => p.x > -PIPE_W)

  // Collision
  const birdL = 40
  const birdT = birdY
  const birdR = birdL + BIRD_SIZE
  const birdB = birdY + BIRD_SIZE

  // Floor / ceiling
  if (birdB > CANVAS_H || birdT < 0) { endGame(); return }

  for (const p of pipes) {
    const pL = p.x
    const pR = p.x + PIPE_W
    if (birdR > pL && birdL < pR) {
      if (birdT < p.topH || birdB > p.topH + PIPE_GAP) {
        endGame()
        return
      }
    }
  }

  // Draw
  // Sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H)
  grad.addColorStop(0, '#0c1445')
  grad.addColorStop(0.5, '#1a237e')
  grad.addColorStop(1, '#1b5e20')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  // Stars
  ctx.fillStyle = 'rgba(255,255,255,0.3)'
  for (let i = 0; i < 30; i++) {
    const sx = (i * 73 + frameCount * 0.1) % CANVAS_W
    const sy = (i * 47) % (CANVAS_H * 0.6)
    ctx.fillRect(sx, sy, 1.5, 1.5)
  }

  // Pipes
  for (const p of pipes) {
    const pipeGrad = ctx.createLinearGradient(p.x, 0, p.x + PIPE_W, 0)
    pipeGrad.addColorStop(0, '#2e7d32')
    pipeGrad.addColorStop(0.5, '#4caf50')
    pipeGrad.addColorStop(1, '#2e7d32')
    ctx.fillStyle = pipeGrad

    // Top pipe
    ctx.fillRect(p.x, 0, PIPE_W, p.topH)
    ctx.fillStyle = '#388e3c'
    ctx.fillRect(p.x - 4, p.topH - 20, PIPE_W + 8, 20)

    // Bottom pipe
    const botY = p.topH + PIPE_GAP
    ctx.fillStyle = pipeGrad
    ctx.fillRect(p.x, botY, PIPE_W, CANVAS_H - botY)
    ctx.fillStyle = '#388e3c'
    ctx.fillRect(p.x - 4, botY, PIPE_W + 8, 20)
  }

  // Bird (circle with wing)
  ctx.save()
  ctx.translate(birdL + BIRD_SIZE / 2, birdY + BIRD_SIZE / 2)
  const angle = Math.min(Math.max(birdVel * 3, -30), 60) * (Math.PI / 180)
  ctx.rotate(angle)

  // Body
  ctx.fillStyle = '#ffc107'
  ctx.beginPath()
  ctx.arc(0, 0, BIRD_SIZE / 2, 0, Math.PI * 2)
  ctx.fill()

  // Eye
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(5, -4, 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#000'
  ctx.beginPath()
  ctx.arc(6, -4, 2, 0, Math.PI * 2)
  ctx.fill()

  // Beak
  ctx.fillStyle = '#ff5722'
  ctx.beginPath()
  ctx.moveTo(BIRD_SIZE / 2 - 2, 0)
  ctx.lineTo(BIRD_SIZE / 2 + 6, 3)
  ctx.lineTo(BIRD_SIZE / 2 - 2, 5)
  ctx.closePath()
  ctx.fill()

  // Wing
  ctx.fillStyle = '#ffb300'
  ctx.beginPath()
  const wingFlap = Math.sin(frameCount * 0.3) * 4
  ctx.ellipse(-4, 3 + wingFlap, 7, 4, -0.3, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()

  // Ground line
  ctx.fillStyle = '#33691e'
  ctx.fillRect(0, CANVAS_H - 2, CANVAS_W, 2)

  frameId = requestAnimationFrame(loop)
}

function endGame() {
  playing.value = false
  gameOver.value = true
  if (score.value > highScore.value) highScore.value = score.value
  cancelAnimationFrame(frameId)
}

onMounted(() => {
  window.addEventListener('keydown', handleKey)
  // Draw initial idle canvas
  const canvas = canvasRef.value
  if (canvas) {
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H)
      grad.addColorStop(0, '#0c1445')
      grad.addColorStop(0.5, '#1a237e')
      grad.addColorStop(1, '#1b5e20')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
    }
  }
})

onUnmounted(() => {
  playing.value = false
  cancelAnimationFrame(frameId)
  window.removeEventListener('keydown', handleKey)
})
</script>
