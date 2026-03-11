<template>
  <div class="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-6 px-4">
    <div class="max-w-2xl mx-auto">

      <!-- Header -->
      <div class="text-center mb-6">
        <NuxtLink to="/games" class="inline-block mb-4 text-gray-400 hover:text-white transition-colors text-sm">
          &larr; {{ $t('memoryGame.back') }}
        </NuxtLink>
        <h1 class="text-4xl font-bold text-white mb-1 flex items-center justify-center gap-3">
          <span class="text-3xl">🧠</span> {{ $t('memoryGame.title') }}
        </h1>
        <p class="text-gray-400 text-sm">{{ $t('memoryGame.subtitle') }}</p>
      </div>

      <!-- Difficulty Selection -->
      <div v-if="!gameStarted" class="glass-card rounded-2xl p-8 text-center">
        <h2 class="text-2xl font-bold text-white mb-6">Choose Difficulty</h2>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="startGame('easy')"
            class="px-6 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg"
          >
            🟢 Easy (4×3)
          </button>
          <button
            @click="startGame('medium')"
            class="px-6 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
          >
            🔵 Medium (4×4)
          </button>
          <button
            @click="startGame('hard')"
            class="px-6 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg"
          >
            🔴 Hard (5×4)
          </button>
        </div>
      </div>

      <!-- Game Area -->
      <div v-else>
        <!-- Stats Bar -->
        <div class="flex justify-center gap-4 mb-6 flex-wrap">
          <div class="glass-card rounded-xl px-5 py-3 text-center">
            <div class="text-2xl font-bold text-blue-400">{{ moves }}</div>
            <div class="text-xs text-gray-400">{{ $t('memoryGame.moves') }}</div>
          </div>
          <div class="glass-card rounded-xl px-5 py-3 text-center">
            <div class="text-2xl font-bold text-purple-400">{{ matchedPairs }}</div>
            <div class="text-xs text-gray-400">{{ $t('memoryGame.pairs') }}</div>
          </div>
          <div class="glass-card rounded-xl px-5 py-3 text-center">
            <div class="text-2xl font-bold text-green-400">{{ formattedTime }}</div>
            <div class="text-xs text-gray-400">{{ $t('memoryGame.time') }}</div>
          </div>
          <div class="glass-card rounded-xl px-5 py-3 text-center">
            <div class="text-2xl font-bold text-yellow-400 capitalize">{{ difficulty }}</div>
            <div class="text-xs text-gray-400">{{ $t('memoryGame.level') }}</div>
          </div>
        </div>

        <!-- Card Grid -->
        <div class="glass-card rounded-2xl p-4 sm:p-6 mb-6">
          <div
            class="grid gap-3 justify-center mx-auto"
            :style="gridStyle"
          >
            <button
              v-for="(card, index) in cards"
              :key="card.id"
              @click="flipCard(index)"
              :disabled="card.matched || isChecking"
              class="aspect-square rounded-xl text-3xl sm:text-4xl flex items-center justify-center transition-all duration-300 cursor-pointer select-none border-2"
              :class="cardClass(card)"
            >
              <span
                class="transition-all duration-300"
                :class="card.flipped || card.matched ? 'scale-100 opacity-100' : 'scale-0 opacity-0'"
              >
                {{ card.emoji }}
              </span>
              <span
                v-if="!card.flipped && !card.matched"
                class="absolute text-2xl"
              >
                ❓
              </span>
            </button>
          </div>
        </div>

        <!-- Win Message -->
        <div v-if="gameWon" class="glass-card rounded-2xl p-6 text-center mb-6 animate-bounce-in">
          <div class="text-4xl mb-3">🎉🏆🎉</div>
          <h2 class="text-2xl font-bold text-white mb-2">{{ $t('memoryGame.congratulations') }}</h2>
          <p class="text-gray-300">
            {{ $t('memoryGame.foundAll', { pairs: totalPairs, moves: moves, time: formattedTime }) }}
          </p>
          <div v-if="isNewBest" class="text-yellow-400 font-semibold mt-2">
            ⭐ {{ $t('memoryGame.newBest') }}
          </div>
        </div>

        <!-- Best Score -->
        <div v-if="bestScore" class="text-center text-gray-400 text-sm mb-4">
          🏅 {{ $t('memoryGame.bestLabel', { difficulty: difficulty, moves: bestScore.moves, time: formatTime(bestScore.time) }) }}
        </div>

        <!-- Controls -->
        <div class="flex justify-center gap-3">
          <button
            @click="restartGame"
            class="px-5 py-2 rounded-xl font-semibold text-white bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg text-sm"
          >
            🔁 {{ $t('memoryGame.restart') }}
          </button>
          <button
            @click="changeDifficulty"
            class="px-5 py-2 rounded-xl font-semibold text-white bg-linear-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg text-sm"
          >
            🔀 {{ $t('memoryGame.changeDifficulty') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

interface Card {
  id: number
  emoji: string
  pairId: number
  flipped: boolean
  matched: boolean
}

interface BestScore {
  moves: number
  time: number
}

type Difficulty = 'easy' | 'medium' | 'hard'

const EMOJIS = ['🚀', '🎸', '🌈', '🦊', '🍕', '🎯', '💎', '🔥', '🌸', '🐉']

const GRID_CONFIG: Record<Difficulty, { cols: number; rows: number }> = {
  easy: { cols: 4, rows: 3 },
  medium: { cols: 4, rows: 4 },
  hard: { cols: 5, rows: 4 },
}

const gameStarted = ref(false)
const difficulty = ref<Difficulty>('medium')
const cards = ref<Card[]>([])
const moves = ref(0)
const matchedPairs = ref(0)
const elapsedSeconds = ref(0)
const isChecking = ref(false)
const isNewBest = ref(false)

let timerInterval: ReturnType<typeof setInterval> | null = null
let flippedIndices: number[] = []

const bestScores = ref<Record<Difficulty, BestScore | null>>({
  easy: null,
  medium: null,
  hard: null,
})

const totalPairs = computed(() => {
  const cfg = GRID_CONFIG[difficulty.value]
  return (cfg.cols * cfg.rows) / 2
})

const gameWon = computed(() => matchedPairs.value === totalPairs.value && gameStarted.value)

const bestScore = computed(() => bestScores.value[difficulty.value])

const gridStyle = computed(() => {
  const cols = GRID_CONFIG[difficulty.value].cols
  return {
    gridTemplateColumns: `repeat(${cols}, minmax(0, 80px))`,
  }
})

const formattedTime = computed(() => formatTime(elapsedSeconds.value))

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function createCards(diff: Difficulty): Card[] {
  const pairCount = (GRID_CONFIG[diff].cols * GRID_CONFIG[diff].rows) / 2
  const emojis = shuffle(EMOJIS).slice(0, pairCount)
  const deck = emojis.flatMap((emoji, i) => [
    { id: i * 2, emoji, pairId: i, flipped: false, matched: false },
    { id: i * 2 + 1, emoji, pairId: i, flipped: false, matched: false },
  ])
  return shuffle(deck)
}

function startGame(diff: Difficulty) {
  difficulty.value = diff
  gameStarted.value = true
  restartGame()
}

function restartGame() {
  stopTimer()
  cards.value = createCards(difficulty.value)
  moves.value = 0
  matchedPairs.value = 0
  elapsedSeconds.value = 0
  isChecking.value = false
  isNewBest.value = false
  flippedIndices = []
  startTimer()
}

function changeDifficulty() {
  stopTimer()
  gameStarted.value = false
}

function startTimer() {
  stopTimer()
  timerInterval = setInterval(() => {
    if (!gameWon.value) {
      elapsedSeconds.value++
    }
  }, 1000)
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function flipCard(index: number) {
  const card = cards.value[index]
  if (card.flipped || card.matched || isChecking.value) return
  if (flippedIndices.length >= 2) return

  card.flipped = true
  flippedIndices.push(index)

  if (flippedIndices.length === 2) {
    moves.value++
    const [i1, i2] = flippedIndices
    const c1 = cards.value[i1]
    const c2 = cards.value[i2]

    if (c1.pairId === c2.pairId) {
      c1.matched = true
      c2.matched = true
      matchedPairs.value++
      flippedIndices = []
      if (gameWon.value) {
        onWin()
      }
    } else {
      isChecking.value = true
      setTimeout(() => {
        c1.flipped = false
        c2.flipped = false
        flippedIndices = []
        isChecking.value = false
      }, 800)
    }
  }
}

function onWin() {
  stopTimer()
  const current = bestScores.value[difficulty.value]
  if (!current || moves.value < current.moves || (moves.value === current.moves && elapsedSeconds.value < current.time)) {
    bestScores.value[difficulty.value] = { moves: moves.value, time: elapsedSeconds.value }
    isNewBest.value = true
  }
}

function cardClass(card: Card): string {
  if (card.matched) return 'bg-green-500/20 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
  if (card.flipped) return 'bg-purple-500/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
  return 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
}

onUnmounted(() => stopTimer())
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.animate-bounce-in {
  animation: bounceIn 0.5s ease-out;
}

@keyframes bounceIn {
  0% { transform: scale(0.8); opacity: 0; }
  60% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}

button:not(:disabled) {
  position: relative;
}
</style>
