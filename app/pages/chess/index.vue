<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <StarIcon class="w-10 h-10 text-yellow-400" />
          Chess Game
        </h1>
        <p class="text-gray-400">Play against a friend or challenge the AI</p>
      </div>

      <!-- Game Mode Selection -->
      <div v-if="!gameStarted" class="bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-2xl mx-auto">
        <h2 class="text-2xl font-semibold text-white mb-6 text-center">Select Game Mode</h2>
        
        <div class="grid md:grid-cols-2 gap-6 mb-8">
          <!-- Multiplayer Option -->
          <button
            @click="selectGameMode('multiplayer')"
            :class="[
              'group relative overflow-hidden rounded-xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-xl',
              selectedMode === 'multiplayer' 
                ? 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-blue-500/30' 
                : 'bg-gradient-to-br from-blue-600 to-blue-800 hover:shadow-blue-500/20'
            ]"
          >
            <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative">
              <UsersIcon class="w-10 h-10 mb-3 text-blue-200" />
              <h3 class="text-xl font-bold text-white mb-2">Multiplayer</h3>
              <p class="text-blue-200 text-sm">Play locally with a friend on the same device</p>
            </div>
          </button>

          <!-- vs Bot Option -->
          <button
            @click="selectGameMode('bot')"
            :class="[
              'group relative overflow-hidden rounded-xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-xl',
              selectedMode === 'bot' 
                ? 'bg-gradient-to-br from-purple-500 to-purple-700 shadow-purple-500/30' 
                : 'bg-gradient-to-br from-purple-600 to-purple-800 hover:shadow-purple-500/20'
            ]"
          >
            <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative">
              <CpuChipIcon class="w-10 h-10 mb-3 text-purple-200" />
              <h3 class="text-xl font-bold text-white mb-2">vs Computer</h3>
              <p class="text-purple-200 text-sm">Challenge the AI with multiple difficulty levels</p>
            </div>
          </button>
        </div>

        <!-- Side Color Selection (for bot mode) -->
        <div v-if="selectedMode === 'bot'" class="border-t border-gray-700 pt-6 mb-6">
          <h3 class="text-lg font-semibold text-white mb-4 text-center">Choose Your Side</h3>
          <div class="grid grid-cols-3 gap-3">
            <button
              @click="selectedPlayerColor = 'w'"
              :class="[
                'rounded-lg p-4 text-center transition-all duration-200',
                selectedPlayerColor === 'w' 
                  ? 'bg-white text-gray-900 shadow-lg' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              ]"
            >
              <div class="w-8 h-8 rounded-full bg-white border-2 border-gray-300 mx-auto mb-2"></div>
              <span class="font-medium">White</span>
            </button>
            <button
              @click="selectedPlayerColor = 'random'"
              :class="[
                'rounded-lg p-4 text-center transition-all duration-200',
                selectedPlayerColor === 'random' 
                  ? 'bg-gradient-to-r from-white to-gray-700 text-gray-900 shadow-lg' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              ]"
            >
              <QuestionMarkCircleIcon class="w-8 h-8 mx-auto mb-2" />
              <span class="font-medium">Random</span>
            </button>
            <button
              @click="selectedPlayerColor = 'b'"
              :class="[
                'rounded-lg p-4 text-center transition-all duration-200',
                selectedPlayerColor === 'b' 
                  ? 'bg-gray-900 text-white border-2 border-white shadow-lg' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              ]"
            >
              <div class="w-8 h-8 rounded-full bg-gray-900 border-2 border-white mx-auto mb-2"></div>
              <span class="font-medium">Black</span>
            </button>
          </div>
        </div>

        <!-- Difficulty Selection (for bot mode) -->
        <div v-if="selectedMode === 'bot'" class="border-t border-gray-700 pt-6 mb-6">
          <h3 class="text-lg font-semibold text-white mb-4 text-center">Select Difficulty</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <button
              v-for="(level, index) in difficultyLevels"
              :key="level.name"
              @click="selectedDifficulty = index"
              :class="[
                'relative rounded-lg p-4 text-left transition-all duration-200',
                selectedDifficulty === index
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/30'
                  : 'bg-gray-700 hover:bg-gray-600'
              ]"
            >
              <div class="flex items-center justify-between mb-1">
                <span class="font-bold text-white">{{ level.name }}</span>
                <span class="text-xs px-2 py-1 rounded-full" :class="getDifficultyBadgeClass(index)">
                  {{ getDifficultyStars(index) }}
                </span>
              </div>
              <p class="text-xs text-gray-300">{{ level.description }}</p>
            </button>
          </div>
        </div>

        <!-- Timer Selection -->
        <div class="border-t border-gray-700 pt-6 mb-6">
          <h3 class="text-lg font-semibold text-white mb-4 text-center">Timer Settings</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <button
              v-for="(preset, key) in TIMER_PRESETS"
              :key="key"
              @click="selectTimer(key)"
              :class="[
                'rounded-lg p-3 text-center transition-all duration-200',
                selectedTimerMode === key 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 shadow-lg shadow-orange-500/30' 
                  : 'bg-gray-700 hover:bg-gray-600'
              ]"
            >
              <ClockIcon class="w-5 h-5 mx-auto mb-1" :class="selectedTimerMode === key ? 'text-white' : 'text-gray-400'" />
              <span class="text-sm font-medium text-white">{{ preset.name }}</span>
            </button>
          </div>
        </div>

        <!-- Sound Toggle -->
        <div class="border-t border-gray-700 pt-6 mb-6">
          <div class="flex items-center justify-center gap-4">
            <button
              @click="soundEnabled = !soundEnabled"
              class="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
              :class="soundEnabled ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'"
            >
              <SpeakerWaveIcon v-if="soundEnabled" class="w-5 h-5" />
              <SpeakerXMarkIcon v-else class="w-5 h-5" />
              <span class="font-medium">{{ soundEnabled ? 'Sound On' : 'Sound Off' }}</span>
            </button>
          </div>
        </div>

        <!-- Start Button -->
        <div class="text-center">
          <button
            @click="startGame"
            :disabled="!selectedMode"
            :class="[
              'px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-2 mx-auto',
              selectedMode
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-105 hover:shadow-xl hover:shadow-green-500/30'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            ]"
          >
            <PlayIcon class="w-6 h-6" />
            {{ selectedMode ? 'Start Game' : 'Select a Game Mode' }}
          </button>
        </div>
      </div>

      <!-- Game Board -->
      <div v-else class="flex flex-col lg:flex-row gap-6">
        <!-- Left Panel - Controls -->
        <div class="lg:w-64 shrink-0 space-y-4">
          <!-- Timer Display -->
          <div v-if="selectedTimerMode !== 'none'" class="bg-gray-800 rounded-xl p-4 shadow-xl">
            <div class="flex justify-between items-center">
              <!-- White Timer -->
              <div 
                :class="[
                  'text-center p-2 rounded-lg flex-1',
                  currentTurn === 'w' ? 'bg-white/20' : '',
                  isWhiteLowTime ? 'bg-red-500/30' : ''
                ]"
              >
                <div class="text-xs text-gray-400 mb-1">White</div>
                <div :class="['font-mono text-xl font-bold', isWhiteLowTime ? 'text-red-400' : 'text-white']">
                  {{ whiteTimeDisplay }}
                </div>
              </div>
              
              <div class="px-2 text-gray-500">vs</div>
              
              <!-- Black Timer -->
              <div 
                :class="[
                  'text-center p-2 rounded-lg flex-1',
                  currentTurn === 'b' ? 'bg-white/20' : '',
                  isBlackLowTime ? 'bg-red-500/30' : ''
                ]"
              >
                <div class="text-xs text-gray-400 mb-1">Black</div>
                <div :class="['font-mono text-xl font-bold', isBlackLowTime ? 'text-red-400' : 'text-white']">
                  {{ blackTimeDisplay }}
                </div>
              </div>
            </div>
          </div>

          <!-- Game Info Card -->
          <div class="bg-gray-800 rounded-xl p-4 shadow-xl">
            <h3 class="text-white font-semibold mb-3 flex items-center gap-2">
              <InformationCircleIcon class="w-5 h-5 text-blue-400" />
              Game Info
            </h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between text-gray-300">
                <span>Mode:</span>
                <span class="text-white font-medium">{{ selectedMode === 'bot' ? 'vs Computer' : 'Multiplayer' }}</span>
              </div>
              <div v-if="selectedMode === 'bot'" class="flex justify-between text-gray-300">
                <span>Difficulty:</span>
                <span class="text-purple-400 font-medium">{{ difficultyLevels[selectedDifficulty]?.name }}</span>
              </div>
              <div v-if="selectedMode === 'bot'" class="flex justify-between text-gray-300">
                <span>You play:</span>
                <span class="text-white font-medium">{{ playerColor === 'w' ? 'White' : 'Black' }}</span>
              </div>
              <div v-if="selectedTimerMode !== 'none'" class="flex justify-between text-gray-300">
                <span>Timer:</span>
                <span class="text-orange-400 font-medium">{{ TIMER_PRESETS[selectedTimerMode].name }}</span>
              </div>
            </div>
          </div>

          <!-- Turn Indicator -->
          <div class="bg-gray-800 rounded-xl p-4 shadow-xl">
            <div class="flex items-center justify-between">
              <span class="text-gray-400 text-sm">Current Turn</span>
              <div class="flex items-center gap-2">
                <div :class="['w-5 h-5 rounded-full shadow-lg', currentTurn === 'w' ? 'bg-white' : 'bg-gray-900 border-2 border-white']"></div>
                <span class="text-white font-semibold">{{ currentTurn === 'w' ? 'White' : 'Black' }}</span>
              </div>
            </div>
            
            <!-- Bot Thinking Indicator -->
            <div v-if="isBotThinking" class="mt-3 flex items-center gap-2 text-yellow-400 bg-yellow-400/10 rounded-lg px-3 py-2">
              <ArrowPathIcon class="w-5 h-5 animate-spin" />
              <span class="text-sm">Bot thinking...</span>
            </div>
          </div>

          <!-- Status Messages -->
          <div v-if="gameStatus" class="rounded-xl p-4 shadow-xl" :class="[
            gameStatus.includes('Checkmate') ? 'bg-red-600' :
            gameStatus.includes('Check') ? 'bg-yellow-600' :
            gameStatus.includes('Draw') || gameStatus.includes('Stalemate') ? 'bg-gray-600' :
            gameStatus.includes('Time') ? 'bg-orange-600' :
            'bg-blue-600'
          ]">
            <div class="flex items-center gap-2 text-white">
              <ExclamationTriangleIcon v-if="gameStatus.includes('Check')" class="w-5 h-5" />
              <TrophyIcon v-if="gameStatus.includes('Win')" class="w-5 h-5" />
              <ClockIcon v-if="gameStatus.includes('Time')" class="w-5 h-5" />
              <span class="font-semibold">{{ gameStatus }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-2">
            <button
              @click="resetGame"
              class="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeftIcon class="w-5 h-5" />
              Back to Menu
            </button>
            <button
              @click="newGame"
              class="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <ArrowPathIcon class="w-5 h-5" />
              New Game
            </button>
            <button
              v-if="moveHistory.length > 0"
              @click="clearHistory"
              class="w-full px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <TrashIcon class="w-5 h-5" />
              Clear History
            </button>
          </div>
        </div>

        <!-- Center - Chessboard with Labels -->
        <div class="flex-1 flex justify-center">
          <div class="bg-gray-800 p-4 rounded-2xl shadow-2xl">
            <!-- Board Container with Labels -->
            <div class="relative">
              <!-- Top Labels (a-h) -->
              <div class="flex justify-center mb-1 ml-6">
                <div 
                  v-for="file in files" 
                  :key="file"
                  class="w-12 sm:w-14 md:w-16 text-center text-xs text-gray-400 font-medium"
                >
                  {{ playerColor === 'w' ? file : reversedFiles[files.indexOf(file)] }}
                </div>
              </div>
              
              <div class="flex">
                <!-- Left Labels (8-1) -->
                <div class="flex flex-col justify-around mr-1">
                  <div 
                    v-for="rank in (playerColor === 'w' ? ranks : reversedRanks)" 
                    :key="rank"
                    class="h-12 sm:h-14 md:h-16 flex items-center justify-center text-xs text-gray-400 font-medium"
                  >
                    {{ rank }}
                  </div>
                </div>
                
                <!-- Chessboard -->
                <TheChessboard
                  :key="boardKey"
                  :player-color="selectedMode === 'bot' ? (playerColor === 'w' ? 'white' : 'black') : undefined"
                  @board-created="onBoardCreated"
                  @move="onMove"
                  @checkmate="onCheckmate"
                  @stalemate="onStalemate"
                  @draw="onDraw"
                  @check="onCheck"
                  @promotion="onPromotion"
                />
                
                <!-- Right Labels (8-1) -->
                <div class="flex flex-col justify-around ml-1">
                  <div 
                    v-for="rank in (playerColor === 'w' ? ranks : reversedRanks)" 
                    :key="rank"
                    class="h-12 sm:h-14 md:h-16 flex items-center justify-center text-xs text-gray-400 font-medium"
                  >
                    {{ rank }}
                  </div>
                </div>
              </div>
              
              <!-- Bottom Labels (a-h) -->
              <div class="flex justify-center mt-1 ml-6">
                <div 
                  v-for="file in files" 
                  :key="file"
                  class="w-12 sm:w-14 md:w-16 text-center text-xs text-gray-400 font-medium"
                >
                  {{ playerColor === 'w' ? file : reversedFiles[files.indexOf(file)] }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel - Move History -->
        <div class="lg:w-72 shrink-0">
          <div class="bg-gray-800 rounded-xl p-4 shadow-xl sticky top-4">
            <h3 class="text-white font-semibold mb-3 flex items-center gap-2">
              <ClockIcon class="w-5 h-5 text-green-400" />
              Move History
            </h3>
            <div class="max-h-96 lg:max-h-[500px] overflow-y-auto">
              <div v-if="moveHistory.length > 0" class="space-y-1">
                <div
                  v-for="(move, index) in moveHistory"
                  :key="index"
                  class="flex items-center gap-2 text-sm py-1 px-2 rounded"
                  :class="index % 2 === 0 ? 'bg-gray-700/50' : 'bg-gray-700/30'"
                >
                  <span class="text-gray-400 w-8 shrink-0">
                    {{ Math.floor(index / 2) + 1 }}{{ index % 2 === 0 ? '.' : '...' }}
                  </span>
                  <span class="text-white font-mono">{{ move }}</span>
                </div>
              </div>
              <p v-else class="text-gray-500 text-sm text-center py-4">No moves yet</p>
            </div>
            
            <!-- Previous Games -->
            <div v-if="previousGames.length > 0" class="mt-4 pt-4 border-t border-gray-700">
              <h4 class="text-gray-400 text-sm mb-2 flex items-center gap-2">
                <ArchiveBoxIcon class="w-4 h-4" />
                Previous Games ({{ previousGames.length }})
              </h4>
              <div class="space-y-2 max-h-40 overflow-y-auto">
                <div
                  v-for="(game, index) in previousGames.slice(-5).reverse()"
                  :key="index"
                  class="text-xs bg-gray-700/50 rounded p-2"
                >
                  <div class="flex justify-between text-gray-400">
                    <span>{{ game.moves.length }} moves</span>
                    <span>{{ game.result }}</span>
                  </div>
                  <div class="text-gray-500 mt-1">{{ game.date }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, nextTick } from 'vue'
import { TheChessboard } from 'vue3-chessboard'
import 'vue3-chessboard/style.css'
import { Chess } from 'chess.js'
import { findBestMove, DIFFICULTY_LEVELS, type DifficultyLevel } from '../../utils/chessBot'
import { useChessSound } from '../../composables/useChessSound'
import { useChessTimer, TIMER_PRESETS, type TimerMode } from '../../composables/useChessTimer'
import { useChessGame, type GameMode } from '../../composables/useChessGame'

import {
  PlayIcon, UsersIcon, CpuChipIcon, StarIcon,
  ArrowLeftIcon, ArrowPathIcon, TrashIcon, ClockIcon,
  ArchiveBoxIcon, InformationCircleIcon, ExclamationTriangleIcon,
  TrophyIcon, QuestionMarkCircleIcon, SpeakerWaveIcon, SpeakerXMarkIcon,
} from '@heroicons/vue/24/outline'

// ─── Board labels ────────────────────────────────────────────────────────────
const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1']
const reversedFiles = [...files].reverse()
const reversedRanks = [...ranks].reverse()

// ─── Composables ─────────────────────────────────────────────────────────────
const {
  gameStarted, selectedMode, selectedDifficulty, playerColor,
  currentTurn, gameStatus, moveHistory, isBotThinking,
  previousGames, saveGame, clearHistory,
} = useChessGame()

const {
  whiteTimeDisplay, blackTimeDisplay,
  isExpired, isWhiteLowTime, isBlackLowTime,
  initTimer, startTimer, stopTimer,
  switchTurn: switchTimerTurn, getTimeoutWinner, resetTimer,
} = useChessTimer()

const {
  playMove, playCapture, playCheck, playCheckmate,
  playGameOver, playCastle, playPromotion, playTimerWarning, playTimerOut,
} = useChessSound()

// ─── Local state ─────────────────────────────────────────────────────────────
const selectedPlayerColor = ref<'w' | 'b' | 'random'>('random')
const selectedTimerMode = ref<TimerMode>('none')
const soundEnabled = ref(true)
const boardKey = ref(0)

let boardApi: any = null
let isGameFinished = false

const difficultyLevels = DIFFICULTY_LEVELS

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Watchers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

watch(isExpired, (expired) => {
  if (!expired) return
  const winner = getTimeoutWinner()
  if (!winner) return

  isGameFinished = true
  if (soundEnabled.value) playTimerOut()

  if (selectedMode.value === 'bot') {
    const playerWon = winner === playerColor.value
    gameStatus.value = playerWon ? 'You Win on Time!' : 'Bot Wins on Time!'
    saveGame(playerWon ? 'Victory (Time)' : 'Defeat (Time)')
  } else {
    const name = winner === 'w' ? 'White' : 'Black'
    gameStatus.value = `${name} Wins on Time!`
    saveGame(`${name} wins on time`)
  }
})

watch([isWhiteLowTime, isBlackLowTime], ([wLow, bLow]) => {
  if (soundEnabled.value && (wLow || bLow)) playTimerWarning()
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Helpers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function getDifficultyBadgeClass(index: number): string {
  const cls = [
    'bg-green-500 text-white', 'bg-blue-500 text-white',
    'bg-yellow-500 text-black', 'bg-orange-500 text-white',
    'bg-red-500 text-white',
  ]
  return cls[index] ?? cls[0]!
}

function getDifficultyStars(index: number): string {
  return '★'.repeat(index + 1)
}

function selectGameMode(mode: GameMode) {
  selectedMode.value = mode
  selectedDifficulty.value = mode === 'bot' ? 2 : -1
}

function selectTimer(key: string) {
  selectedTimerMode.value = key as TimerMode
}

/** Play the right sound for a given SAN string */
function playSoundForMove(san: string, captured: boolean) {
  if (captured || san.includes('x')) playCapture()
  else if (san === 'O-O' || san === 'O-O-O') playCastle()
  else playMove()
}

/** Sync `currentTurn` from the board's internal chess.js state */
function syncTurnFromBoard() {
  if (!boardApi) return
  try {
    const color = boardApi.getTurnColor() // 'white' | 'black'
    currentTurn.value = color === 'white' ? 'w' : 'b'
  } catch {
    currentTurn.value = currentTurn.value === 'w' ? 'b' : 'w'
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Game Lifecycle
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function startGame() {
  if (!selectedMode.value) return

  // Resolve player color
  if (selectedMode.value === 'bot') {
    playerColor.value =
      selectedPlayerColor.value === 'random'
        ? (Math.random() > 0.5 ? 'w' : 'b')
        : selectedPlayerColor.value
  }

  initTimer(selectedTimerMode.value)

  gameStatus.value = ''
  moveHistory.value = []
  currentTurn.value = 'w'
  isGameFinished = false
  boardApi = null
  boardKey.value++

  gameStarted.value = true
}

function resetGame() {
  stopTimer()
  resetTimer()
  gameStarted.value = false
  selectedMode.value = null
  selectedDifficulty.value = 2
  gameStatus.value = ''
  moveHistory.value = []
  currentTurn.value = 'w'
  isBotThinking.value = false
  isGameFinished = false
  boardApi = null
}

function newGame() {
  stopTimer()

  if (selectedMode.value === 'bot' && selectedPlayerColor.value === 'random') {
    playerColor.value = Math.random() > 0.5 ? 'w' : 'b'
  }

  gameStatus.value = ''
  moveHistory.value = []
  currentTurn.value = 'w'
  isBotThinking.value = false
  isGameFinished = false
  boardApi = null

  resetTimer()

  // Force Vue to destroy & recreate the chessboard component
  gameStarted.value = false
  nextTick(() => {
    boardKey.value++
    initTimer(selectedTimerMode.value)
    gameStarted.value = true
  })
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Board Callbacks
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function onBoardCreated(api: any) {
  boardApi = api

  if (selectedTimerMode.value !== 'none') {
    startTimer()
  }

  // If player chose black, let the bot make the first move as white
  if (selectedMode.value === 'bot' && playerColor.value === 'b') {
    setTimeout(() => makeBotMove(), 500)
  }
}

/**
 * Fires for EVERY move (player AND bot).
 * `isBotThinking` prevents us from recursively triggering `makeBotMove`.
 *
 * FIX: uses `data.color` (the side that just moved) instead of the
 *      non-existent `data.turn` to derive whose turn it is now.
 */
function onMove(data: any) {
  if (!data || isGameFinished) return

  // Record move
  if (data.san) moveHistory.value.push(data.san)

  // Derive current turn — the side that just moved is in `data.color`
  if (data.color) {
    currentTurn.value = data.color === 'w' ? 'b' : 'w'
  } else {
    syncTurnFromBoard()
  }

  // Sound
  if (soundEnabled.value && data.san) {
    playSoundForMove(data.san, !!data.captured)
  }

  // Timer
  if (selectedTimerMode.value !== 'none') {
    switchTimerTurn()
  }

  // Clear transient check status from the previous ply
  if (gameStatus.value === 'Check!') {
    gameStatus.value = ''
  }

  // Trigger bot if it is the bot's turn and we are not already thinking
  if (
    selectedMode.value === 'bot' &&
    !isBotThinking.value &&
    !isGameFinished
  ) {
    const isBotTurn =
      (currentTurn.value === 'w' && playerColor.value === 'b') ||
      (currentTurn.value === 'b' && playerColor.value === 'w')

    if (isBotTurn) {
      setTimeout(() => makeBotMove(), 200)
    }
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Bot Logic
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Calculate and play the bot's move.
 *
 * ARCHITECTURE FIX:
 * - We no longer maintain a separate Chess instance.
 * - A *throwaway* Chess is built from `boardApi.getFen()` for the minimax
 *   search, so the board's own internal state is never corrupted.
 * - The move is then applied via `boardApi.move()` which triggers `onMove`.
 */
async function makeBotMove() {
  if (!boardApi || isBotThinking.value || isGameFinished) return
  if (boardApi.getIsGameOver()) return

  isBotThinking.value = true

  // Small UX delay so the "thinking…" indicator is visible
  await new Promise((r) => setTimeout(r, 350))

  try {
    // Re-check after delay (player might have resigned / timer ran out)
    if (!boardApi || isGameFinished || boardApi.getIsGameOver()) return

    const difficulty = difficultyLevels[selectedDifficulty.value]
    if (!difficulty) return

    // Build a throwaway Chess instance from the board's current FEN
    const fen = boardApi.getFen()
    const tempChess = new Chess(fen)

    if (tempChess.isGameOver() || tempChess.moves().length === 0) return

    // Find the best move (with automatic fallback to random inside findBestMove)
    let bestMove = findBestMove(tempChess as any, difficulty)

    // Extra safety: fallback to any legal move
    if (!bestMove) {
      const legalMoves = tempChess.moves()
      if (legalMoves.length > 0) {
        bestMove = legalMoves[Math.floor(Math.random() * legalMoves.length)]!
      }
    }

    if (!bestMove) return

    // Apply via the board API — this triggers @move → onMove
    const ok = boardApi.move(bestMove)

    if (!ok) {
      // SAN parsing edge-case: fall back to a random legal move
      console.warn('[Bot] SAN move failed, falling back to random move')
      const moves = new Chess(boardApi.getFen()).moves()
      if (moves.length > 0) {
        boardApi.move(moves[Math.floor(Math.random() * moves.length)]!)
      }
    }
  } catch (err) {
    console.error('[Bot] move error:', err)
    // Emergency fallback — try any legal move so the game doesn't freeze
    try {
      if (boardApi && !boardApi.getIsGameOver()) {
        const moves = new Chess(boardApi.getFen()).moves()
        if (moves.length > 0) {
          boardApi.move(moves[Math.floor(Math.random() * moves.length)]!)
        }
      }
    } catch { /* give up gracefully */ }
  } finally {
    isBotThinking.value = false
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Game-ending Callbacks
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * FIX: vue3-chessboard emits `@checkmate` with `board.state.turnColor`
 * which is the colour that IS IN CHECKMATE (the loser).
 * Previously this was incorrectly parsed as `data?.winner`.
 */
function onCheckmate(checkmatedColor: string) {
  stopTimer()
  isGameFinished = true
  if (soundEnabled.value) playCheckmate()

  // The winner is the opposite of the checkmated colour
  const winnerIsWhite = checkmatedColor === 'black'
  const winnerColor: 'w' | 'b' = winnerIsWhite ? 'w' : 'b'
  const winnerName = winnerIsWhite ? 'White' : 'Black'

  gameStatus.value = 'Checkmate!'

  setTimeout(() => {
    if (selectedMode.value === 'bot') {
      const playerWon = winnerColor === playerColor.value
      gameStatus.value = playerWon ? 'You Win!' : 'Bot Wins!'
      saveGame(playerWon ? 'Victory' : 'Defeat')
    } else {
      gameStatus.value = `${winnerName} Wins!`
      saveGame(`${winnerName} wins`)
    }
  }, 500)
}

function onStalemate() {
  stopTimer()
  isGameFinished = true
  if (soundEnabled.value) playGameOver()
  gameStatus.value = 'Stalemate!'
  setTimeout(() => {
    gameStatus.value = 'Draw - Stalemate!'
    saveGame('Stalemate')
  }, 500)
}

function onDraw() {
  stopTimer()
  isGameFinished = true
  if (soundEnabled.value) playGameOver()
  gameStatus.value = 'Draw!'
  saveGame('Draw')
}

function onCheck() {
  if (soundEnabled.value) playCheck()
  gameStatus.value = 'Check!'
}

function onPromotion() {
  if (soundEnabled.value) playPromotion()
}

// ─── Cleanup ─────────────────────────────────────────────────────────────────
onUnmounted(() => { stopTimer() })
</script>

<style scoped>
/* Custom scrollbar for move history */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #374151;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
