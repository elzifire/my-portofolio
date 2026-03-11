<template>
  <div class="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-6 px-4">
    <div class="max-w-lg mx-auto">
      <!-- Header -->
      <div class="text-center mb-6">
        <NuxtLink to="/games" class="inline-block mb-4 text-gray-400 hover:text-white transition-colors text-sm">
          &larr; {{ $t('games.backToGames') }}
        </NuxtLink>
        <h1 class="text-4xl font-bold text-white mb-1 flex items-center justify-center gap-3">
          <span class="text-3xl">⚡</span> {{ $t('reaction.title') }}
        </h1>
        <p class="text-gray-400 text-sm">{{ $t('reaction.subtitle') }}</p>
      </div>

      <!-- Best Score -->
      <div v-if="bestTime" class="text-center text-gray-400 text-sm mb-4">
        🏅 {{ $t('reaction.bestTime') }}: <span class="text-yellow-400 font-bold">{{ bestTime }}ms</span>
      </div>

      <!-- Click Area -->
      <button
        @click="handleClick"
        class="w-full aspect-[4/3] rounded-2xl text-center flex flex-col items-center justify-center transition-all duration-200 select-none cursor-pointer"
        :class="areaClass"
      >
        <template v-if="phase === 'waiting'">
          <div class="text-5xl mb-3">🎯</div>
          <p class="text-xl font-bold text-white">{{ $t('reaction.clickToStart') }}</p>
          <p class="text-gray-400 text-sm mt-1">{{ $t('reaction.getReady') }}</p>
        </template>

        <template v-else-if="phase === 'ready'">
          <div class="text-5xl mb-3">🔴</div>
          <p class="text-xl font-bold text-red-300">{{ $t('reaction.waitForGreen') }}</p>
        </template>

        <template v-else-if="phase === 'go'">
          <div class="text-5xl mb-3">🟢</div>
          <p class="text-xl font-bold text-green-300">{{ $t('reaction.clickNow') }}</p>
        </template>

        <template v-else-if="phase === 'tooEarly'">
          <div class="text-5xl mb-3">😬</div>
          <p class="text-xl font-bold text-orange-300">{{ $t('reaction.tooEarly') }}</p>
          <p class="text-gray-400 text-sm mt-1">{{ $t('reaction.clickToRetry') }}</p>
        </template>

        <template v-else-if="phase === 'result'">
          <div class="text-5xl mb-3">{{ resultEmoji }}</div>
          <p class="text-5xl font-bold text-white mb-1">{{ reactionTime }}ms</p>
          <p class="text-gray-400 text-sm">{{ resultLabel }}</p>
          <p class="text-gray-500 text-xs mt-2">{{ $t('reaction.clickToRetry') }}</p>
        </template>
      </button>

      <!-- History -->
      <div v-if="history.length > 0" class="mt-6">
        <h3 class="text-white font-semibold mb-3 text-sm">{{ $t('reaction.history') }}</h3>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="(time, i) in history"
            :key="i"
            class="glass-card rounded-lg px-3 py-2 text-center"
          >
            <div class="text-sm font-bold" :class="timeColor(time)">{{ time }}ms</div>
            <div class="text-[10px] text-gray-500">#{{ i + 1 }}</div>
          </div>
        </div>
        <div class="mt-3 glass-card rounded-xl p-3 flex justify-between text-sm">
          <span class="text-gray-400">{{ $t('reaction.average') }}:</span>
          <span class="text-blue-400 font-bold">{{ averageTime }}ms</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const { t } = useI18n()

type Phase = 'waiting' | 'ready' | 'go' | 'tooEarly' | 'result'

const phase = ref<Phase>('waiting')
const reactionTime = ref(0)
const bestTime = ref<number | null>(null)
const history = ref<number[]>([])

let goTimeStamp = 0
let readyTimeout: ReturnType<typeof setTimeout> | null = null

const averageTime = computed(() => {
  if (history.value.length === 0) return 0
  return Math.round(history.value.reduce((a, b) => a + b, 0) / history.value.length)
})

const resultEmoji = computed(() => {
  const t = reactionTime.value
  if (t < 200) return '🚀'
  if (t < 300) return '⚡'
  if (t < 400) return '👍'
  return '🐢'
})

const resultLabel = computed(() => {
  const ms = reactionTime.value
  if (ms < 200) return t('reaction.incredible')
  if (ms < 300) return t('reaction.fast')
  if (ms < 400) return t('reaction.average')
  return t('reaction.slow')
})

const areaClass = computed(() => {
  switch (phase.value) {
    case 'ready': return 'bg-red-900/40 border-2 border-red-500/30'
    case 'go': return 'bg-green-900/40 border-2 border-green-500/30'
    case 'tooEarly': return 'bg-orange-900/40 border-2 border-orange-500/30'
    case 'result': return 'glass-card'
    default: return 'glass-card hover:bg-white/10'
  }
})

function handleClick() {
  switch (phase.value) {
    case 'waiting':
    case 'tooEarly':
      startRound()
      break
    case 'ready':
      // Clicked too early
      if (readyTimeout) clearTimeout(readyTimeout)
      phase.value = 'tooEarly'
      break
    case 'go':
      reactionTime.value = Math.round(performance.now() - goTimeStamp)
      history.value.push(reactionTime.value)
      if (!bestTime.value || reactionTime.value < bestTime.value) {
        bestTime.value = reactionTime.value
      }
      phase.value = 'result'
      break
    case 'result':
      startRound()
      break
  }
}

function startRound() {
  phase.value = 'ready'
  const delay = 1500 + Math.random() * 3500 // 1.5-5s random
  readyTimeout = setTimeout(() => {
    phase.value = 'go'
    goTimeStamp = performance.now()
  }, delay)
}

function timeColor(ms: number): string {
  if (ms < 200) return 'text-green-400'
  if (ms < 300) return 'text-blue-400'
  if (ms < 400) return 'text-yellow-400'
  return 'text-red-400'
}
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
