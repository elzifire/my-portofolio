<template>
  <div class="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-6 px-4">
    <div class="max-w-lg mx-auto">
      <!-- Header -->
      <div class="text-center mb-6">
        <NuxtLink to="/games" class="inline-block mb-4 text-gray-400 hover:text-white transition-colors text-sm">
          &larr; {{ $t('games.backToGames') }}
        </NuxtLink>
        <h1 class="text-4xl font-bold text-white mb-1 flex items-center justify-center gap-3">
          <span class="text-3xl">🧩</span> {{ $t('sudokuGame.title') }}
        </h1>
        <p class="text-gray-400 text-sm">{{ $t('sudokuGame.subtitle') }}</p>
      </div>

      <!-- Difficulty Selection -->
      <div v-if="!gameStarted" class="glass-card rounded-2xl p-8 text-center">
        <h2 class="text-2xl font-bold text-white mb-6">{{ $t('sudokuGame.chooseDifficulty') }}</h2>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button @click="startGame('easy')" class="px-6 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 transition-all shadow-lg">
            🟢 {{ $t('sudokuGame.easy') }}
          </button>
          <button @click="startGame('medium')" class="px-6 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg">
            🔵 {{ $t('sudokuGame.medium') }}
          </button>
          <button @click="startGame('hard')" class="px-6 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 transition-all shadow-lg">
            🔴 {{ $t('sudokuGame.hard') }}
          </button>
        </div>
      </div>

      <!-- Game Board -->
      <div v-else>
        <!-- Stats -->
        <div class="flex justify-center gap-4 mb-5 flex-wrap">
          <div class="glass-card rounded-xl px-5 py-3 text-center">
            <div class="text-2xl font-bold text-blue-400">{{ mistakes }}</div>
            <div class="text-xs text-gray-400">{{ $t('sudokuGame.mistakes') }}</div>
          </div>
          <div class="glass-card rounded-xl px-5 py-3 text-center">
            <div class="text-2xl font-bold text-green-400">{{ formattedTime }}</div>
            <div class="text-xs text-gray-400">{{ $t('sudokuGame.time') }}</div>
          </div>
          <div class="glass-card rounded-xl px-5 py-3 text-center">
            <div class="text-2xl font-bold text-yellow-400 capitalize">{{ difficulty }}</div>
            <div class="text-xs text-gray-400">{{ $t('sudokuGame.level') }}</div>
          </div>
        </div>

        <!-- Board -->
        <div class="glass-card rounded-2xl p-2 sm:p-3 mb-5">
          <div class="grid grid-cols-9 gap-0 border-2 border-gray-500 mx-auto max-w-[360px]">
            <button
              v-for="(val, idx) in board"
              :key="idx"
              @click="selectCell(idx)"
              class="aspect-square flex items-center justify-center text-sm sm:text-base font-bold transition-all select-none border border-gray-700"
              :class="cellClass(idx)"
              :style="cellBorder(idx)"
            >
              {{ val || '' }}
            </button>
          </div>
        </div>

        <!-- Number Pad -->
        <div class="flex justify-center gap-2 mb-5 flex-wrap">
          <button
            v-for="n in 9"
            :key="n"
            @click="placeNumber(n)"
            class="w-10 h-10 sm:w-11 sm:h-11 rounded-lg font-bold text-white transition-all"
            :class="numCounts[n] >= 9 ? 'bg-gray-700/30 text-gray-600 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600 hover:scale-105'"
            :disabled="numCounts[n] >= 9"
          >
            {{ n }}
          </button>
          <button
            @click="eraseCell"
            class="w-10 h-10 sm:w-11 sm:h-11 rounded-lg font-bold text-white bg-red-600/60 hover:bg-red-600 transition-all hover:scale-105"
          >
            ✕
          </button>
        </div>

        <!-- Win / Lose -->
        <div v-if="won || lost" class="glass-card rounded-2xl p-6 text-center mb-5 animate-bounce-in">
          <div class="text-4xl mb-2">{{ won ? '🎉' : '😞' }}</div>
          <h2 class="text-2xl font-bold text-white mb-2">{{ won ? $t('sudokuGame.youWin') : $t('sudokuGame.tooManyMistakes') }}</h2>
          <p class="text-gray-300 text-sm">{{ $t('sudokuGame.time') }}: {{ formattedTime }}</p>
        </div>

        <!-- Controls -->
        <div class="flex justify-center gap-3">
          <button @click="restartGame" class="px-5 py-2 rounded-xl font-semibold text-white bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg text-sm">
            🔄 {{ $t('sudokuGame.restart') }}
          </button>
          <button @click="gameStarted = false; stopTimer()" class="px-5 py-2 rounded-xl font-semibold text-white bg-linear-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg text-sm">
            🔀 {{ $t('sudokuGame.changeDifficulty') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

type Difficulty = 'easy' | 'medium' | 'hard'

const gameStarted = ref(false)
const difficulty = ref<Difficulty>('easy')
const board = ref<number[]>(Array(81).fill(0))
const solution = ref<number[]>(Array(81).fill(0))
const given = ref<boolean[]>(Array(81).fill(false))
const selectedCell = ref<number | null>(null)
const mistakes = ref(0)
const won = ref(false)
const lost = ref(false)
const timer = ref(0)
let timerInterval: ReturnType<typeof setInterval> | null = null

const MAX_MISTAKES = 5

const REMOVE_COUNT: Record<Difficulty, number> = { easy: 30, medium: 40, hard: 52 }

const formattedTime = computed(() => {
  const m = Math.floor(timer.value / 60)
  const s = timer.value % 60
  return `${m}:${s.toString().padStart(2, '0')}`
})

const numCounts = computed(() => {
  const counts: Record<number, number> = {}
  for (let n = 1; n <= 9; n++) counts[n] = 0
  board.value.forEach(v => { if (v >= 1 && v <= 9) counts[v]++ })
  return counts
})

// ---- Sudoku Generator ----
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function isValid(grid: number[], row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (grid[row * 9 + i] === num) return false
    if (grid[i * 9 + col] === num) return false
  }
  const r0 = Math.floor(row / 3) * 3
  const c0 = Math.floor(col / 3) * 3
  for (let r = r0; r < r0 + 3; r++) {
    for (let c = c0; c < c0 + 3; c++) {
      if (grid[r * 9 + c] === num) return false
    }
  }
  return true
}

function solveSudoku(grid: number[]): boolean {
  for (let i = 0; i < 81; i++) {
    if (grid[i] === 0) {
      const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])
      const row = Math.floor(i / 9)
      const col = i % 9
      for (const n of nums) {
        if (isValid(grid, row, col, n)) {
          grid[i] = n
          if (solveSudoku(grid)) return true
          grid[i] = 0
        }
      }
      return false
    }
  }
  return true
}

function generatePuzzle(diff: Difficulty) {
  const grid = Array(81).fill(0)
  solveSudoku(grid)
  solution.value = [...grid]

  const toRemove = REMOVE_COUNT[diff]
  const indices = shuffle(Array.from({ length: 81 }, (_, i) => i))
  for (let i = 0; i < toRemove; i++) {
    grid[indices[i]] = 0
  }

  board.value = [...grid]
  given.value = grid.map(v => v !== 0)
}

// ---- Game Logic ----
function startGame(diff: Difficulty) {
  difficulty.value = diff
  gameStarted.value = true
  restartGame()
}

function restartGame() {
  stopTimer()
  mistakes.value = 0
  won.value = false
  lost.value = false
  selectedCell.value = null
  timer.value = 0
  generatePuzzle(difficulty.value)
  startTimer()
}

function selectCell(idx: number) {
  if (given.value[idx] || won.value || lost.value) return
  selectedCell.value = idx
}

function placeNumber(n: number) {
  if (selectedCell.value === null || won.value || lost.value) return
  const idx = selectedCell.value
  if (given.value[idx]) return

  if (solution.value[idx] !== n) {
    mistakes.value++
    if (mistakes.value >= MAX_MISTAKES) {
      lost.value = true
      stopTimer()
    }
    return
  }

  board.value[idx] = n

  // Check win
  if (board.value.every((v, i) => v === solution.value[i])) {
    won.value = true
    stopTimer()
  }
}

function eraseCell() {
  if (selectedCell.value === null || won.value || lost.value) return
  if (given.value[selectedCell.value]) return
  board.value[selectedCell.value] = 0
}

function cellClass(idx: number) {
  const isSelected = selectedCell.value === idx
  const isGiven = given.value[idx]
  const val = board.value[idx]

  if (isSelected) return 'bg-blue-500/30 text-white'

  // Highlight same number
  if (selectedCell.value !== null && val && val === board.value[selectedCell.value])
    return 'bg-blue-500/10 text-blue-300'

  // Highlight same row/col/box
  if (selectedCell.value !== null) {
    const sr = Math.floor(selectedCell.value / 9)
    const sc = selectedCell.value % 9
    const cr = Math.floor(idx / 9)
    const cc = idx % 9
    const sameRow = sr === cr
    const sameCol = sc === cc
    const sameBox = Math.floor(sr / 3) === Math.floor(cr / 3) && Math.floor(sc / 3) === Math.floor(cc / 3)
    if (sameRow || sameCol || sameBox) return 'bg-white/5 ' + (isGiven ? 'text-gray-300' : 'text-blue-400')
  }

  if (isGiven) return 'bg-gray-800/50 text-gray-300'
  return 'bg-gray-800/30 text-blue-400'
}

function cellBorder(idx: number) {
  const r = Math.floor(idx / 9)
  const c = idx % 9
  const style: Record<string, string> = {}
  if (c % 3 === 0 && c !== 0) style.borderLeft = '2px solid #6b7280'
  if (r % 3 === 0 && r !== 0) style.borderTop = '2px solid #6b7280'
  return style
}

function startTimer() {
  stopTimer()
  timerInterval = setInterval(() => { timer.value++ }, 1000)
}

function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null }
}

onUnmounted(() => stopTimer())
</script>
