<template>
  <div class="min-h-screen transition-colors duration-300 relative"
    :class="isDark ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'">
    
    <!-- Back Button -->
    <div class="fixed top-4 left-4 z-50">
      <NuxtLink to="/"
        class="glass-card px-4 py-2 rounded-full font-medium inline-flex items-center gap-2 transition-all duration-300 hover:scale-105"
        :class="isDark ? 'text-white hover:text-primary-400' : 'text-gray-800 hover:text-primary-600'">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </NuxtLink>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-20">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-2">
          🐍 <span class="gradient-text">Snake Game</span>
        </h1>
        <p :class="isDark ? 'text-gray-400' : 'text-gray-600'">Use arrow keys or WASD to control</p>
      </div>

      <!-- Game Container -->
      <div class="glass-card rounded-3xl p-8 max-w-lg mx-auto">
        <!-- Score -->
        <div class="flex justify-between items-center mb-6">
          <div class="glass-card px-4 py-2 rounded-xl">
            <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Score</span>
            <p class="text-2xl font-bold gradient-text">{{ score }}</p>
          </div>
          <div class="glass-card px-4 py-2 rounded-xl">
            <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">High Score</span>
            <p class="text-2xl font-bold gradient-text">{{ highScore }}</p>
          </div>
        </div>

        <!-- Game Board -->
        <div class="relative rounded-2xl overflow-hidden border-2 mx-auto"
          :class="isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'"
          :style="{ width: boardSize + 'px', height: boardSize + 'px' }">
          
          <!-- Grid Lines -->
          <div class="absolute inset-0 opacity-10">
            <div v-for="i in gridSize" :key="'h-' + i" class="absolute w-full border-b"
              :class="isDark ? 'border-gray-600' : 'border-gray-300'"
              :style="{ top: (i * cellSize) + 'px' }"></div>
            <div v-for="i in gridSize" :key="'v-' + i" class="absolute h-full border-r"
              :class="isDark ? 'border-gray-600' : 'border-gray-300'"
              :style="{ left: (i * cellSize) + 'px' }"></div>
          </div>

          <!-- Snake -->
          <div v-for="(segment, index) in snake" :key="'s-' + index"
            class="absolute rounded-md transition-all duration-75"
            :style="{
              left: segment.x * cellSize + 1 + 'px',
              top: segment.y * cellSize + 1 + 'px',
              width: cellSize - 2 + 'px',
              height: cellSize - 2 + 'px',
              background: index === 0 
                ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
                : `linear-gradient(135deg, #60a5fa, #a78bfa)`,
              opacity: 1 - (index * 0.03),
              zIndex: 10
            }">
            <!-- Eyes on head -->
            <div v-if="index === 0" class="flex items-center justify-center h-full gap-1">
              <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
              <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>

          <!-- Food -->
          <div class="absolute z-20 flex items-center justify-center animate-pulse"
            :style="{
              left: food.x * cellSize + 'px',
              top: food.y * cellSize + 'px',
              width: cellSize + 'px',
              height: cellSize + 'px'
            }">
            <span class="text-lg">🍎</span>
          </div>

          <!-- Game Over Overlay -->
          <div v-if="gameOver"
            class="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-30">
            <div class="text-center">
              <p class="text-3xl font-bold text-white mb-2">Game Over!</p>
              <p class="text-gray-300 mb-4">Score: {{ score }}</p>
              <button @click="resetGame"
                class="btn-primary px-6 py-3 rounded-full text-white font-semibold">
                Play Again
              </button>
            </div>
          </div>

          <!-- Start Screen -->
          <div v-if="!gameStarted && !gameOver"
            class="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-30">
            <div class="text-center">
              <p class="text-2xl font-bold text-white mb-4">Press Space to Start</p>
              <p class="text-gray-300 text-sm">Arrow keys or WASD to move</p>
            </div>
          </div>
        </div>

        <!-- Mobile Controls -->
        <div class="mt-6 grid grid-cols-3 gap-2 max-w-[200px] mx-auto md:hidden">
          <div></div>
          <button @click="changeDirection('up')"
            class="glass-card p-3 rounded-xl flex items-center justify-center active:scale-95 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <div></div>
          <button @click="changeDirection('left')"
            class="glass-card p-3 rounded-xl flex items-center justify-center active:scale-95 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button @click="changeDirection('down')"
            class="glass-card p-3 rounded-xl flex items-center justify-center active:scale-95 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button @click="changeDirection('right')"
            class="glass-card p-3 rounded-xl flex items-center justify-center active:scale-95 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject, computed, type Ref } from 'vue'

const isDark = inject<Ref<boolean>>('isDark', ref(false))

const gridSize = 20
const cellSize = computed(() => Math.floor(boardSize.value / gridSize))
const boardSize = ref(400)

interface Point { x: number; y: number }

const snake = ref<Point[]>([{ x: 10, y: 10 }])
const food = ref<Point>({ x: 15, y: 15 })
const direction = ref<'up' | 'down' | 'left' | 'right'>('right')
const nextDirection = ref<'up' | 'down' | 'left' | 'right'>('right')
const score = ref(0)
const highScore = ref(0)
const gameOver = ref(false)
const gameStarted = ref(false)
let gameLoop: ReturnType<typeof setInterval> | null = null

const spawnFood = () => {
  let newFood: Point
  do {
    newFood = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    }
  } while (snake.value.some(s => s.x === newFood.x && s.y === newFood.y))
  food.value = newFood
}

const moveSnake = () => {
  if (gameOver.value || !gameStarted.value) return
  
  direction.value = nextDirection.value
  const head = { ...snake.value[0] }

  switch (direction.value) {
    case 'up': head.y--; break
    case 'down': head.y++; break
    case 'left': head.x--; break
    case 'right': head.x++; break
  }

  // Wall collision
  if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
    endGame()
    return
  }

  // Self collision
  if (snake.value.some(s => s.x === head.x && s.y === head.y)) {
    endGame()
    return
  }

  snake.value.unshift(head)

  // Eat food
  if (head.x === food.value.x && head.y === food.value.y) {
    score.value += 10
    spawnFood()
  } else {
    snake.value.pop()
  }
}

const endGame = () => {
  gameOver.value = true
  gameStarted.value = false
  if (score.value > highScore.value) {
    highScore.value = score.value
    localStorage.setItem('snakeHighScore', highScore.value.toString())
  }
  if (gameLoop) clearInterval(gameLoop)
}

const resetGame = () => {
  snake.value = [{ x: 10, y: 10 }]
  direction.value = 'right'
  nextDirection.value = 'right'
  score.value = 0
  gameOver.value = false
  gameStarted.value = true
  spawnFood()
  startLoop()
}

const startLoop = () => {
  if (gameLoop) clearInterval(gameLoop)
  gameLoop = setInterval(moveSnake, 120)
}

const changeDirection = (dir: 'up' | 'down' | 'left' | 'right') => {
  if (!gameStarted.value && !gameOver.value) {
    gameStarted.value = true
    startLoop()
  }
  
  const opposites = { up: 'down', down: 'up', left: 'right', right: 'left' } as const
  if (opposites[dir] !== direction.value) {
    nextDirection.value = dir
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.code === 'Space' && !gameStarted.value) {
    e.preventDefault()
    resetGame()
    return
  }

  const keyMap: Record<string, 'up' | 'down' | 'left' | 'right'> = {
    ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
    KeyW: 'up', KeyS: 'down', KeyA: 'left', KeyD: 'right'
  }
  
  if (keyMap[e.code]) {
    e.preventDefault()
    changeDirection(keyMap[e.code])
  }
}

onMounted(() => {
  const saved = localStorage.getItem('snakeHighScore')
  if (saved) highScore.value = parseInt(saved)
  
  if (window.innerWidth < 500) boardSize.value = 300
  
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  if (gameLoop) clearInterval(gameLoop)
  window.removeEventListener('keydown', handleKeydown)
})
</script>
