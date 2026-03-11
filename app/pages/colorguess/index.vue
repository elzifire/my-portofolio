<template>
  <div class="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-6 px-4">
    <div class="max-w-lg mx-auto">
      <!-- Header -->
      <div class="text-center mb-6">
        <NuxtLink to="/games" class="inline-block mb-4 text-gray-400 hover:text-white transition-colors text-sm">
          &larr; {{ $t('games.backToGames') }}
        </NuxtLink>
        <h1 class="text-4xl font-bold text-white mb-1 flex items-center justify-center gap-3">
          <span class="text-3xl">🎨</span> {{ $t('colorguess.title') }}
        </h1>
        <p class="text-gray-400 text-sm">{{ $t('colorguess.subtitle') }}</p>
      </div>

      <!-- Stats -->
      <div class="flex justify-center gap-4 mb-6">
        <div class="glass-card rounded-xl px-5 py-3 text-center">
          <div class="text-2xl font-bold text-green-400">{{ score }}</div>
          <div class="text-xs text-gray-400">{{ $t('colorguess.score') }}</div>
        </div>
        <div class="glass-card rounded-xl px-5 py-3 text-center">
          <div class="text-2xl font-bold text-blue-400">{{ round }}/10</div>
          <div class="text-xs text-gray-400">{{ $t('colorguess.round') }}</div>
        </div>
        <div class="glass-card rounded-xl px-5 py-3 text-center">
          <div class="text-2xl font-bold text-purple-400">{{ streak }}🔥</div>
          <div class="text-xs text-gray-400">{{ $t('colorguess.streak') }}</div>
        </div>
      </div>

      <!-- Color Display -->
      <div class="glass-card rounded-2xl p-6 mb-6 text-center" v-if="!gameOver">
        <p class="text-gray-400 text-sm mb-3">{{ $t('colorguess.whatColor') }}</p>
        <div class="text-5xl font-mono font-bold text-white mb-4 tracking-wider">
          {{ currentHex }}
        </div>
        <div
          v-if="showResult !== null"
          class="w-32 h-32 rounded-2xl mx-auto mb-3 transition-all duration-300"
          :style="{ backgroundColor: currentHex }"
        ></div>
      </div>

      <!-- Options -->
      <div v-if="!gameOver" class="grid grid-cols-2 gap-3 mb-6">
        <button
          v-for="(opt, i) in options"
          :key="i"
          @click="guess(i)"
          :disabled="showResult !== null"
          class="h-24 rounded-2xl transition-all duration-300 border-3"
          :class="optionClass(i)"
          :style="{ backgroundColor: opt }"
        >
        </button>
      </div>

      <!-- Feedback -->
      <div v-if="showResult !== null" class="text-center mb-4">
        <span class="inline-block px-4 py-2 rounded-full text-sm font-semibold" :class="showResult ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'">
          {{ showResult ? $t('colorguess.correct') : $t('colorguess.wrong') }}
        </span>
      </div>

      <!-- Game Over -->
      <div v-if="gameOver" class="glass-card rounded-2xl p-8 text-center animate-bounce-in">
        <div class="text-4xl mb-3">{{ score >= 7 ? '🏆' : score >= 4 ? '👍' : '😅' }}</div>
        <h2 class="text-2xl font-bold text-white mb-2">{{ $t('colorguess.gameOver') }}</h2>
        <p class="text-gray-300 mb-4">{{ $t('colorguess.finalScore', { score, total: 10 }) }}</p>
        <button @click="startGame()" class="px-6 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg">
          🔄 {{ $t('colorguess.playAgain') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const score = ref(0)
const round = ref(0)
const streak = ref(0)
const gameOver = ref(false)
const showResult = ref<boolean | null>(null)
const currentHex = ref('#000000')
const options = ref<string[]>([])
const correctIndex = ref(0)

function randomHex(): string {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function similarColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const vary = () => Math.max(0, Math.min(255, Math.floor(Math.random() * 120) - 60))
  const nr = Math.max(0, Math.min(255, r + vary()))
  const ng = Math.max(0, Math.min(255, g + vary()))
  const nb = Math.max(0, Math.min(255, b + vary()))
  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`
}

function generateRound() {
  const correct = randomHex()
  currentHex.value = correct.toUpperCase()

  const opts = [correct]
  while (opts.length < 4) {
    const c = similarColor(correct)
    if (!opts.includes(c)) opts.push(c)
  }

  // Shuffle
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[opts[i], opts[j]] = [opts[j], opts[i]]
  }

  options.value = opts
  correctIndex.value = opts.indexOf(correct)
  showResult.value = null
}

function guess(i: number) {
  if (showResult.value !== null) return
  const isCorrect = i === correctIndex.value
  showResult.value = isCorrect
  if (isCorrect) {
    score.value++
    streak.value++
  } else {
    streak.value = 0
  }
  setTimeout(() => {
    round.value++
    if (round.value >= 10) {
      gameOver.value = true
    } else {
      generateRound()
    }
  }, 1200)
}

function startGame() {
  score.value = 0
  round.value = 0
  streak.value = 0
  gameOver.value = false
  showResult.value = null
  generateRound()
}

function optionClass(i: number): string {
  if (showResult.value === null) return 'border-transparent hover:border-white/30 hover:scale-105 cursor-pointer'
  if (i === correctIndex.value) return 'border-green-400 ring-2 ring-green-400/50'
  if (showResult.value === false) return 'border-transparent opacity-50'
  return 'border-transparent opacity-50'
}

onMounted(() => startGame())
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
