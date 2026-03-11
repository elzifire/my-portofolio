<template>
  <div class="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-6 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-6">
        <NuxtLink to="/games" class="inline-block mb-4 text-gray-400 hover:text-white transition-colors text-sm">
          &larr; {{ $t('typingGame.back') }}
        </NuxtLink>
        <h1 class="text-4xl font-bold text-white mb-1 flex items-center justify-center gap-3">
          <span class="text-3xl">⌨️</span> {{ $t('typingGame.title') }}
        </h1>
        <p class="text-gray-400 text-sm">{{ $t('typingGame.subtitle') }}</p>
      </div>

      <!-- Duration Selection -->
      <div v-if="phase === 'setup'" class="glass-card rounded-2xl p-8 text-center">
        <h2 class="text-2xl font-bold text-white mb-6">{{ $t('typingGame.chooseDuration') }}</h2>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button @click="startTest(15)" class="px-6 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 transition-all shadow-lg">
            ⚡ {{ $t('typingGame.sec15') }}
          </button>
          <button @click="startTest(30)" class="px-6 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg">
            🕐 {{ $t('typingGame.sec30') }}
          </button>
          <button @click="startTest(60)" class="px-6 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 transition-all shadow-lg">
            🔥 {{ $t('typingGame.sec60') }}
          </button>
        </div>
      </div>

      <!-- Typing Test -->
      <div v-else-if="phase === 'typing'">
        <!-- Stats Bar -->
        <div class="flex justify-center gap-4 mb-5 flex-wrap">
          <div class="glass-card rounded-xl px-5 py-3 text-center">
            <div class="text-2xl font-bold text-blue-400">{{ timeLeft }}</div>
            <div class="text-xs text-gray-400">{{ $t('typingGame.seconds') }}</div>
          </div>
          <div class="glass-card rounded-xl px-5 py-3 text-center">
            <div class="text-2xl font-bold text-green-400">{{ liveWpm }}</div>
            <div class="text-xs text-gray-400">{{ $t('typingGame.wpm') }}</div>
          </div>
          <div class="glass-card rounded-xl px-5 py-3 text-center">
            <div class="text-2xl font-bold text-purple-400">{{ liveAccuracy }}%</div>
            <div class="text-xs text-gray-400">{{ $t('typingGame.accuracy') }}</div>
          </div>
        </div>

        <!-- Text Display -->
        <div class="glass-card rounded-2xl p-5 mb-5 font-mono text-lg leading-relaxed tracking-wide">
          <span
            v-for="(char, i) in targetChars"
            :key="i"
            :class="charClass(i)"
          >{{ char }}</span>
        </div>

        <!-- Hidden input -->
        <input
          ref="inputRef"
          v-model="typed"
          @input="onInput"
          class="opacity-0 absolute -z-10"
          autofocus
        />
        <p class="text-center text-gray-500 text-sm">
          <button @click="focusInput" class="underline hover:text-white transition-colors">{{ $t('typingGame.clickHere') }}</button> {{ $t('typingGame.ifNotWorking') }}
        </p>
      </div>

      <!-- Results -->
      <div v-else-if="phase === 'done'">
        <div class="glass-card rounded-2xl p-8 text-center mb-5 animate-bounce-in">
          <div class="text-4xl mb-3">{{ resultEmoji }}</div>
          <h2 class="text-3xl font-bold text-white mb-4">{{ finalWpm }} WPM</h2>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div class="text-2xl font-bold text-green-400">{{ finalAccuracy }}%</div>
              <div class="text-xs text-gray-400">{{ $t('typingGame.accuracy') }}</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-blue-400">{{ correctChars }}</div>
              <div class="text-xs text-gray-400">{{ $t('typingGame.correct') }}</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-red-400">{{ wrongChars }}</div>
              <div class="text-xs text-gray-400">{{ $t('typingGame.errors') }}</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-purple-400">{{ totalCharsTyped }}</div>
              <div class="text-xs text-gray-400">{{ $t('typingGame.characters') }}</div>
            </div>
          </div>
        </div>

        <div class="flex justify-center gap-3">
          <button @click="startTest(duration)" class="px-5 py-2 rounded-xl font-semibold text-white bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg text-sm">
            🔄 {{ $t('typingGame.tryAgain') }}
          </button>
          <button @click="phase = 'setup'" class="px-5 py-2 rounded-xl font-semibold text-white bg-linear-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg text-sm">
            🔀 {{ $t('typingGame.changeDuration') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onUnmounted } from 'vue'

const WORD_POOL = [
  'the','be','to','of','and','a','in','that','have','i','it','for','not','on','with',
  'he','as','you','do','at','this','but','his','by','from','they','we','her','she','or',
  'an','will','my','one','all','would','there','their','what','so','up','out','if','about',
  'who','get','which','go','me','when','make','can','like','time','no','just','him','know',
  'take','people','into','year','your','good','some','could','them','see','other','than',
  'then','now','look','only','come','its','over','think','also','back','after','use','two',
  'how','our','work','first','well','way','even','new','want','because','any','these','give',
  'day','most','us','great','between','need','large','often','hand','high','place','hold',
  'find','here','thing','many','right','still','each','never','next','might','much','long',
  'world','very','help','through','line','before','turn','move','house','case','point','same',
  'another','every','system','show','side','under','small','end','group','begin','while',
  'number','part','problem','run','city','home','left','state','name','keep','play','start',
  'around','set','should','old','school','power','close','order','open','change','program',
  'study','follow','head','life','form','call','write','last','real','area','ask','hard',
  'later','own','country','question','during','story','rate','tell','field','light','lead',
]

type Phase = 'setup' | 'typing' | 'done'

const phase = ref<Phase>('setup')
const duration = ref(30)
const timeLeft = ref(0)
const typed = ref('')
const targetText = ref('')
const correctChars = ref(0)
const wrongChars = ref(0)
const totalCharsTyped = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)

let timerInterval: ReturnType<typeof setInterval> | null = null

const targetChars = computed(() => targetText.value.split(''))

const liveWpm = computed(() => {
  const elapsed = duration.value - timeLeft.value
  if (elapsed <= 0) return 0
  return Math.round((correctChars.value / 5) / (elapsed / 60))
})

const liveAccuracy = computed(() => {
  if (totalCharsTyped.value === 0) return 100
  return Math.round((correctChars.value / totalCharsTyped.value) * 100)
})

const finalWpm = ref(0)
const finalAccuracy = ref(0)

const resultEmoji = computed(() => {
  if (finalWpm.value >= 80) return '🚀'
  if (finalWpm.value >= 60) return '🔥'
  if (finalWpm.value >= 40) return '👍'
  if (finalWpm.value >= 20) return '🐢'
  return '🐌'
})

function generateText(): string {
  const words: string[] = []
  for (let i = 0; i < 200; i++) {
    words.push(WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)])
  }
  return words.join(' ')
}

function startTest(dur: number) {
  duration.value = dur
  timeLeft.value = dur
  typed.value = ''
  targetText.value = generateText()
  correctChars.value = 0
  wrongChars.value = 0
  totalCharsTyped.value = 0
  phase.value = 'typing'
  nextTick(() => focusInput())
  startTimer()
}

function startTimer() {
  stopTimer()
  timerInterval = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) endTest()
  }, 1000)
}

function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null }
}

function onInput() {
  const t = typed.value
  const len = t.length
  // Recalculate from scratch for accuracy
  let correct = 0
  let wrong = 0
  for (let i = 0; i < len; i++) {
    if (i < targetText.value.length && t[i] === targetText.value[i]) correct++
    else wrong++
  }
  correctChars.value = correct
  wrongChars.value = wrong
  totalCharsTyped.value = len
}

function endTest() {
  stopTimer()
  finalWpm.value = liveWpm.value
  finalAccuracy.value = liveAccuracy.value
  phase.value = 'done'
}

function charClass(i: number): string {
  if (i >= typed.value.length) return 'text-gray-500'
  if (typed.value[i] === targetText.value[i]) return 'text-green-400'
  return 'text-red-400 bg-red-500/20'
}

function focusInput() {
  inputRef.value?.focus()
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
  animation: bounceIn 0.4s ease-out;
}
@keyframes bounceIn {
  0% { transform: scale(0.8); opacity: 0; }
  60% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}
</style>
