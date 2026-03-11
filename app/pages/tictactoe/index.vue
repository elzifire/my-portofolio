<template>
  <div class="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-6 px-4">
    <div class="max-w-2xl mx-auto">

      <!-- Header -->
      <div class="text-center mb-6">
        <NuxtLink to="/games" class="inline-block mb-4 text-gray-400 hover:text-white transition-colors text-sm">
          &larr; {{ $t('ttt.back') }}
        </NuxtLink>
        <h1 class="text-4xl font-bold text-white mb-1 flex items-center justify-center gap-3">
          <span class="text-3xl">❌⭕</span> {{ $t('ttt.title') }}
        </h1>
        <p class="text-gray-400 text-sm">{{ $t('ttt.subtitle') }}</p>
      </div>

      <!-- Mode Selection -->
      <div v-if="!gameStarted" class="glass-card rounded-2xl p-8 text-center">
        <h2 class="text-2xl font-bold text-white mb-6">{{ $t('ttt.chooseMode') }}</h2>
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <button
            @click="startGame('pvp')"
            class="px-6 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
          >
            👥 {{ $t('ttt.pvp') }}
          </button>
          <button
            @click="startGame('easy')"
            class="px-6 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg"
          >
            🤖 {{ $t('ttt.easyBot') }}
          </button>
          <button
            @click="startGame('hard')"
            class="px-6 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg"
          >
            🧠 {{ $t('ttt.hardBot') }}
          </button>
        </div>
      </div>

      <!-- Game Board -->
      <div v-else>
        <!-- Score Board -->
        <div class="flex justify-center gap-6 mb-6">
          <div class="glass-card rounded-xl px-6 py-3 text-center">
            <div class="text-2xl font-bold text-blue-400">{{ scores.X }}</div>
            <div class="text-xs text-gray-400">X ({{ mode === 'pvp' ? $t('ttt.player1') : $t('ttt.you') }})</div>
          </div>
          <div class="glass-card rounded-xl px-6 py-3 text-center">
            <div class="text-2xl font-bold text-gray-400">{{ scores.draw }}</div>
            <div class="text-xs text-gray-400">{{ $t('ttt.draw') }}</div>
          </div>
          <div class="glass-card rounded-xl px-6 py-3 text-center">
            <div class="text-2xl font-bold text-red-400">{{ scores.O }}</div>
            <div class="text-xs text-gray-400">O ({{ mode === 'pvp' ? $t('ttt.player2') : $t('ttt.bot') }})</div>
          </div>
        </div>

        <!-- Status Message -->
        <div class="text-center mb-4">
          <span
            class="inline-block px-4 py-2 rounded-full text-sm font-semibold"
            :class="statusClass"
          >
            {{ statusMessage }}
          </span>
        </div>

        <!-- Board Grid -->
        <div class="flex justify-center mb-6">
          <div class="grid grid-cols-3 gap-2 p-3 glass-card rounded-2xl">
            <button
              v-for="(cell, i) in board"
              :key="i"
              @click="makeMove(i)"
              :disabled="!!cell || !!winner || (isBotTurn && mode !== 'pvp')"
              class="w-24 h-24 sm:w-28 sm:h-28 rounded-xl text-5xl sm:text-6xl font-bold transition-all duration-200 flex items-center justify-center"
              :class="cellClass(i)"
            >
              <Transition name="pop" mode="out-in">
                <span v-if="cell" :key="cell">{{ cell === 'X' ? '❌' : '⭕' }}</span>
              </Transition>
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-center gap-4">
          <button
            @click="resetBoard"
            class="px-5 py-2 rounded-xl font-semibold text-white bg-gray-700 hover:bg-gray-600 transition-all duration-300"
          >
            🔄 {{ $t('ttt.newRound') }}
          </button>
          <button
            @click="resetAll"
            class="px-5 py-2 rounded-xl font-semibold text-white bg-red-600/80 hover:bg-red-600 transition-all duration-300"
          >
            🏠 {{ $t('ttt.changeMode') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { checkWinner, easyBotMove, hardBotMove, type Cell } from '~/utils/tictactoeGame'

const { t } = useI18n()

type Mode = 'pvp' | 'easy' | 'hard'

const board = ref<Cell[]>(Array(9).fill(null))
const currentPlayer = ref<'X' | 'O'>('X')
const winner = ref<'X' | 'O' | 'draw' | null>(null)
const gameStarted = ref(false)
const mode = ref<Mode>('pvp')
const scores = ref({ X: 0, O: 0, draw: 0 })
const winLine = ref<number[] | null>(null)
const botThinking = ref(false)

const isBotTurn = computed(() =>
  mode.value !== 'pvp' && currentPlayer.value === 'O' && !winner.value
)

const statusMessage = computed(() => {
  if (winner.value === 'draw') return t('ttt.itsDraw')
  if (winner.value) return `${winner.value === 'X' ? '❌' : '⭕'} ${t('ttt.wins')}`
  if (botThinking.value) return t('ttt.botThinking')
  return `${currentPlayer.value === 'X' ? '❌' : '⭕'} ${currentPlayer.value}${t('ttt.turn')}`
})

const statusClass = computed(() => {
  if (winner.value === 'draw') return 'bg-gray-600/50 text-gray-300'
  if (winner.value === 'X') return 'bg-blue-500/20 text-blue-400'
  if (winner.value === 'O') return 'bg-red-500/20 text-red-400'
  if (currentPlayer.value === 'X') return 'bg-blue-500/10 text-blue-300'
  return 'bg-red-500/10 text-red-300'
})

function cellClass(i: number) {
  const isWin = winLine.value?.includes(i)
  if (isWin) return 'bg-green-500/30 border-2 border-green-400 scale-105'
  if (board.value[i]) return 'bg-gray-700/50 cursor-default'
  if (winner.value || botThinking.value) return 'bg-gray-800/50 cursor-not-allowed'
  return 'bg-gray-800/50 hover:bg-gray-700/70 cursor-pointer hover:scale-105'
}

function startGame(m: Mode) {
  mode.value = m
  gameStarted.value = true
  resetBoard()
  scores.value = { X: 0, O: 0, draw: 0 }
}

function applyMove(i: number) {
  board.value[i] = currentPlayer.value
  const result = checkWinner(board.value)
  if (result.winner) {
    winner.value = result.winner
    winLine.value = result.line
    if (result.winner !== 'draw') scores.value[result.winner]++
    else scores.value.draw++
    return true
  }
  currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X'
  return false
}

function makeMove(i: number) {
  if (board.value[i] || winner.value || botThinking.value) return
  applyMove(i)
  if (mode.value !== 'pvp' && currentPlayer.value === 'O' && !winner.value) {
    botThinking.value = true
    nextTick(() => setTimeout(botMove, 300))
  }
}

function botMove() {
  if (winner.value) { botThinking.value = false; return }
  const i = mode.value === 'hard'
    ? hardBotMove([...board.value])
    : easyBotMove([...board.value])
  if (i !== -1) applyMove(i)
  botThinking.value = false
}

function resetBoard() {
  board.value = Array(9).fill(null)
  currentPlayer.value = 'X'
  winner.value = null
  winLine.value = null
  botThinking.value = false
}

function resetAll() {
  resetBoard()
  gameStarted.value = false
}
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.pop-enter-active {
  animation: pop-in 0.3s ease-out;
}

@keyframes pop-in {
  0% { transform: scale(0); opacity: 0; }
  70% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}
</style>
