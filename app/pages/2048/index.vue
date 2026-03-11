<template>
  <div class="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-6 px-4">
    <div class="max-w-lg mx-auto">
      <!-- Header -->
      <div class="text-center mb-6">
        <NuxtLink to="/games" class="inline-block mb-4 text-gray-400 hover:text-white transition-colors text-sm">
          &larr; {{ $t('game2048.back') }}
        </NuxtLink>
        <h1 class="text-4xl font-bold text-white mb-1 flex items-center justify-center gap-3">
          <span class="text-3xl">🔢</span> {{ $t('game2048.title') }}
        </h1>
        <p class="text-gray-400 text-sm">{{ $t('game2048.subtitle') }}</p>
      </div>

      <!-- Score -->
      <div class="flex justify-center gap-4 mb-5">
        <div class="glass-card rounded-xl px-5 py-3 text-center">
          <div class="text-2xl font-bold text-blue-400">{{ score }}</div>
          <div class="text-xs text-gray-400">{{ $t('game2048.score') }}</div>
        </div>
        <div class="glass-card rounded-xl px-5 py-3 text-center">
          <div class="text-2xl font-bold text-yellow-400">{{ bestScore }}</div>
          <div class="text-xs text-gray-400">{{ $t('game2048.best') }}</div>
        </div>
      </div>

      <!-- Board -->
      <div
        class="glass-card rounded-2xl p-3 mb-5 select-none touch-none"
        @touchstart.prevent="onTouchStart"
        @touchend.prevent="onTouchEnd"
      >
        <div class="grid grid-cols-4 gap-2">
          <div
            v-for="(val, i) in grid"
            :key="i"
            class="aspect-square rounded-xl flex items-center justify-center font-bold transition-all duration-150"
            :class="tileClass(val)"
            :style="tileFontSize(val)"
          >
            {{ val || '' }}
          </div>
        </div>
      </div>

      <!-- Game Over / Win -->
      <div v-if="gameOver || won" class="glass-card rounded-2xl p-6 text-center mb-5 animate-bounce-in">
        <div class="text-4xl mb-2">{{ won ? '🎉' : '😢' }}</div>
        <h2 class="text-2xl font-bold text-white mb-2">{{ won ? $t('game2048.youWin') : $t('game2048.gameOver') }}</h2>
        <p class="text-gray-300 mb-3">{{ $t('game2048.score') }}: {{ score }}</p>
      </div>

      <!-- Controls -->
      <div class="flex justify-center gap-3 mb-4">
        <button @click="init()" class="px-5 py-2 rounded-xl font-semibold text-white bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg text-sm">
          🔄 {{ $t('game2048.newGame') }}
        </button>
      </div>

      <p class="text-center text-gray-500 text-xs">{{ $t('game2048.hint') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const SIZE = 4
const grid = ref<number[]>(Array(SIZE * SIZE).fill(0))
const score = ref(0)
const bestScore = ref(0)
const gameOver = ref(false)
const won = ref(false)

let touchStartX = 0
let touchStartY = 0

function init() {
  grid.value = Array(SIZE * SIZE).fill(0)
  score.value = 0
  gameOver.value = false
  won.value = false
  addRandom()
  addRandom()
}

function addRandom() {
  const empty: number[] = []
  grid.value.forEach((v, i) => { if (v === 0) empty.push(i) })
  if (empty.length === 0) return
  const idx = empty[Math.floor(Math.random() * empty.length)]
  grid.value[idx] = Math.random() < 0.9 ? 2 : 4
}

function getRow(r: number): number[] {
  return grid.value.slice(r * SIZE, r * SIZE + SIZE)
}
function setRow(r: number, row: number[]) {
  for (let c = 0; c < SIZE; c++) grid.value[r * SIZE + c] = row[c]
}
function getCol(c: number): number[] {
  return Array.from({ length: SIZE }, (_, r) => grid.value[r * SIZE + c])
}
function setCol(c: number, col: number[]) {
  for (let r = 0; r < SIZE; r++) grid.value[r * SIZE + c] = col[r]
}

function mergeLine(line: number[]): { merged: number[]; pts: number } {
  const filtered = line.filter(v => v !== 0)
  let pts = 0
  const result: number[] = []
  let i = 0
  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      const val = filtered[i] * 2
      result.push(val)
      pts += val
      if (val === 2048) won.value = true
      i += 2
    } else {
      result.push(filtered[i])
      i++
    }
  }
  while (result.length < SIZE) result.push(0)
  return { merged: result, pts }
}

function move(dir: 'left' | 'right' | 'up' | 'down') {
  if (gameOver.value) return
  const prev = [...grid.value]
  let pts = 0

  if (dir === 'left' || dir === 'right') {
    for (let r = 0; r < SIZE; r++) {
      let row = getRow(r)
      if (dir === 'right') row.reverse()
      const res = mergeLine(row)
      if (dir === 'right') res.merged.reverse()
      setRow(r, res.merged)
      pts += res.pts
    }
  } else {
    for (let c = 0; c < SIZE; c++) {
      let col = getCol(c)
      if (dir === 'down') col.reverse()
      const res = mergeLine(col)
      if (dir === 'down') res.merged.reverse()
      setCol(c, res.merged)
      pts += res.pts
    }
  }

  const changed = grid.value.some((v, i) => v !== prev[i])
  if (changed) {
    score.value += pts
    if (score.value > bestScore.value) bestScore.value = score.value
    addRandom()
    if (!canMove()) gameOver.value = true
  }
}

function canMove(): boolean {
  for (let i = 0; i < SIZE * SIZE; i++) {
    if (grid.value[i] === 0) return true
    const r = Math.floor(i / SIZE)
    const c = i % SIZE
    if (c + 1 < SIZE && grid.value[i] === grid.value[r * SIZE + c + 1]) return true
    if (r + 1 < SIZE && grid.value[i] === grid.value[(r + 1) * SIZE + c]) return true
  }
  return false
}

function onKey(e: KeyboardEvent) {
  const map: Record<string, 'left' | 'right' | 'up' | 'down'> = {
    ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
  }
  const dir = map[e.key]
  if (dir) { e.preventDefault(); move(dir) }
}

function onTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}

function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - touchStartX
  const dy = e.changedTouches[0].clientY - touchStartY
  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)
  if (Math.max(absDx, absDy) < 30) return
  if (absDx > absDy) move(dx > 0 ? 'right' : 'left')
  else move(dy > 0 ? 'down' : 'up')
}

const TILE_COLORS: Record<number, string> = {
  0: 'bg-white/5 text-transparent',
  2: 'bg-gray-200 text-gray-800',
  4: 'bg-gray-300 text-gray-800',
  8: 'bg-orange-400 text-white',
  16: 'bg-orange-500 text-white',
  32: 'bg-orange-600 text-white',
  64: 'bg-red-500 text-white',
  128: 'bg-yellow-400 text-gray-800',
  256: 'bg-yellow-500 text-white',
  512: 'bg-yellow-600 text-white',
  1024: 'bg-amber-500 text-white',
  2048: 'bg-amber-400 text-white ring-2 ring-amber-300',
}

function tileClass(val: number): string {
  return TILE_COLORS[val] || 'bg-purple-600 text-white'
}

function tileFontSize(val: number): Record<string, string> {
  if (val >= 1024) return { fontSize: '1.1rem' }
  if (val >= 128) return { fontSize: '1.3rem' }
  return { fontSize: '1.5rem' }
}

onMounted(() => {
  init()
  window.addEventListener('keydown', onKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
})
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
