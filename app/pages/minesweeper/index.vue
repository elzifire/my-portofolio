<template>
  <div class="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-6 px-4">
    <div class="max-w-xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-6">
        <NuxtLink to="/games" class="inline-block mb-4 text-gray-400 hover:text-white transition-colors text-sm">
          &larr; {{ $t('mineGame.back') }}
        </NuxtLink>
        <h1 class="text-4xl font-bold text-white mb-1 flex items-center justify-center gap-3">
          <span class="text-3xl">💣</span> {{ $t('mineGame.title') }}
        </h1>
        <p class="text-gray-400 text-sm">{{ $t('mineGame.subtitle') }}</p>
      </div>

      <!-- Difficulty -->
      <div v-if="!gameStarted" class="glass-card rounded-2xl p-8 text-center">
        <h2 class="text-2xl font-bold text-white mb-6">{{ $t('mineGame.chooseDifficulty') }}</h2>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button @click="start(9, 9, 10)" class="px-6 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 transition-all shadow-lg">
            🟢 {{ $t('mineGame.easy') }}
          </button>
          <button @click="start(12, 12, 25)" class="px-6 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg">
            🟣 {{ $t('mineGame.medium') }}
          </button>
          <button @click="start(16, 12, 45)" class="px-6 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 transition-all shadow-lg">
            🔴 {{ $t('mineGame.hard') }}
          </button>
        </div>
      </div>

      <!-- Game -->
      <div v-else>
        <!-- Stats -->
        <div class="flex justify-center gap-4 mb-5 flex-wrap">
          <div class="glass-card rounded-xl px-5 py-3 text-center">
            <div class="text-2xl font-bold text-red-400">{{ minesLeft }}</div>
            <div class="text-xs text-gray-400">💣 {{ $t('mineGame.mines') }}</div>
          </div>
          <div class="glass-card rounded-xl px-5 py-3 text-center">
            <div class="text-2xl font-bold text-green-400">{{ timer }}</div>
            <div class="text-xs text-gray-400">⏱ {{ $t('mineGame.time') }}</div>
          </div>
          <div class="glass-card rounded-xl px-5 py-3 text-center">
            <div class="text-2xl font-bold text-yellow-400 capitalize">{{ status === 'playing' ? $t('mineGame.playing') : status }}</div>
            <div class="text-xs text-gray-400">{{ $t('mineGame.status') }}</div>
          </div>
        </div>

        <!-- Board -->
        <div class="glass-card rounded-2xl p-2 sm:p-3 mb-5 overflow-x-auto">
          <div class="inline-grid gap-0.5" :style="{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }">
            <button
              v-for="(cell, idx) in board"
              :key="idx"
              @click="reveal(idx)"
              @contextmenu.prevent="toggleFlag(idx)"
              @pointerdown="onPointerDown(idx, $event)"
              @pointerup="onPointerUp"
              @pointerleave="onPointerUp"
              class="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold rounded transition-all select-none"
              :class="cellClass(cell)"
            >
              {{ cellDisplay(cell) }}
            </button>
          </div>
        </div>

        <!-- Result -->
        <div v-if="status !== 'playing'" class="glass-card rounded-2xl p-5 text-center mb-5 animate-bounce-in">
          <div class="text-4xl mb-2">{{ status === 'won' ? '🎉' : '💥' }}</div>
          <h2 class="text-xl font-bold text-white">{{ status === 'won' ? $t('mineGame.youWin') : $t('mineGame.gameOver') }}</h2>
          <p class="text-gray-300 text-sm mt-1">{{ $t('mineGame.time') }}: {{ timer }}s</p>
        </div>

        <!-- Controls -->
        <div class="flex justify-center gap-3">
          <button @click="restart()" class="px-5 py-2 rounded-xl font-semibold text-white bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg text-sm">
            🔄 {{ $t('mineGame.restart') }}
          </button>
          <button @click="gameStarted = false; stopTimer()" class="px-5 py-2 rounded-xl font-semibold text-white bg-linear-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg text-sm">
            🔀 {{ $t('mineGame.changeDifficulty') }}
          </button>
        </div>
        <p class="text-center text-gray-500 text-xs mt-3">{{ $t('mineGame.hint') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

interface Cell {
  mine: boolean
  revealed: boolean
  flagged: boolean
  adjacent: number
}

const rows = ref(9)
const cols = ref(9)
const mineCount = ref(10)
const board = ref<Cell[]>([])
const gameStarted = ref(false)
const status = ref<'playing' | 'won' | 'lost'>('playing')
const timer = ref(0)
const firstClick = ref(true)

let timerInterval: ReturnType<typeof setInterval> | null = null
let longPressTimer: ReturnType<typeof setTimeout> | null = null

const minesLeft = computed(() => {
  const flagged = board.value.filter(c => c.flagged).length
  return mineCount.value - flagged
})

function start(c: number, r: number, m: number) {
  cols.value = c
  rows.value = r
  mineCount.value = m
  gameStarted.value = true
  restart()
}

function restart() {
  stopTimer()
  const total = rows.value * cols.value
  board.value = Array.from({ length: total }, () => ({
    mine: false, revealed: false, flagged: false, adjacent: 0,
  }))
  status.value = 'playing'
  timer.value = 0
  firstClick.value = true
}

function placeMines(safeIdx: number) {
  const total = rows.value * cols.value
  const safe = new Set<number>()
  // Safe zone: clicked cell + neighbors
  safe.add(safeIdx)
  for (const n of getNeighbors(safeIdx)) safe.add(n)

  let placed = 0
  while (placed < mineCount.value) {
    const idx = Math.floor(Math.random() * total)
    if (!safe.has(idx) && !board.value[idx].mine) {
      board.value[idx].mine = true
      placed++
    }
  }
  // Compute adjacency
  for (let i = 0; i < total; i++) {
    if (!board.value[i].mine) {
      board.value[i].adjacent = getNeighbors(i).filter(n => board.value[n].mine).length
    }
  }
}

function getNeighbors(idx: number): number[] {
  const r = Math.floor(idx / cols.value)
  const c = idx % cols.value
  const result: number[] = []
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const nr = r + dr
      const nc = c + dc
      if (nr >= 0 && nr < rows.value && nc >= 0 && nc < cols.value) {
        result.push(nr * cols.value + nc)
      }
    }
  }
  return result
}

function reveal(idx: number) {
  if (status.value !== 'playing') return
  const cell = board.value[idx]
  if (cell.revealed || cell.flagged) return

  if (firstClick.value) {
    firstClick.value = false
    placeMines(idx)
    startTimer()
  }

  if (cell.mine) {
    // Reveal all mines
    board.value.forEach(c => { if (c.mine) c.revealed = true })
    status.value = 'lost'
    stopTimer()
    return
  }

  floodReveal(idx)
  checkWin()
}

function floodReveal(idx: number) {
  const stack = [idx]
  while (stack.length) {
    const i = stack.pop()!
    const cell = board.value[i]
    if (cell.revealed || cell.mine) continue
    cell.revealed = true
    cell.flagged = false
    if (cell.adjacent === 0) {
      for (const n of getNeighbors(i)) {
        if (!board.value[n].revealed) stack.push(n)
      }
    }
  }
}

function toggleFlag(idx: number) {
  if (status.value !== 'playing') return
  const cell = board.value[idx]
  if (cell.revealed) return
  cell.flagged = !cell.flagged
}

function checkWin() {
  const total = rows.value * cols.value
  const unrevealed = board.value.filter(c => !c.revealed).length
  if (unrevealed === mineCount.value) {
    status.value = 'won'
    stopTimer()
    board.value.forEach(c => { if (c.mine) c.flagged = true })
  }
}

function startTimer() {
  stopTimer()
  timerInterval = setInterval(() => { timer.value++ }, 1000)
}

function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null }
}

// Long-press support for mobile flagging
function onPointerDown(idx: number, e: PointerEvent) {
  if (e.button === 2) return // right-click handled by contextmenu
  longPressTimer = setTimeout(() => {
    toggleFlag(idx)
    longPressTimer = null
  }, 500)
}

function onPointerUp() {
  if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null }
}

const NUM_COLORS = ['', 'text-blue-400', 'text-green-400', 'text-red-400', 'text-purple-400', 'text-amber-500', 'text-teal-400', 'text-pink-400', 'text-gray-300']

function cellClass(cell: Cell): string {
  if (cell.revealed && cell.mine) return 'bg-red-600/60 text-white'
  if (cell.revealed) return `bg-gray-700/60 ${NUM_COLORS[cell.adjacent] || 'text-white'}`
  if (cell.flagged) return 'bg-yellow-600/30 border border-yellow-500/50'
  return 'bg-white/10 hover:bg-white/20 cursor-pointer border border-white/5'
}

function cellDisplay(cell: Cell): string {
  if (cell.flagged && !cell.revealed) return '🚩'
  if (!cell.revealed) return ''
  if (cell.mine) return '💣'
  return cell.adjacent > 0 ? String(cell.adjacent) : ''
}

onUnmounted(() => { stopTimer() })
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.animate-bounce-in {
  animation: bounceIn 0.4s ease-out;
}
@keyframes bounceIn {
  0% { transform: scale(0.8); opacity: 0; }
  60% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}
</style>
