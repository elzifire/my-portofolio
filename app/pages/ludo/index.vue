<template>
  <div class="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-6 px-4">
    <div class="max-w-7xl mx-auto">

      <!-- Header -->
      <div class="text-center mb-6">
        <h1 class="text-4xl font-bold text-white mb-1 flex items-center justify-center gap-3">
          <span class="text-3xl">🎲</span> Ludo Game
        </h1>
        <p class="text-gray-400 text-sm">Roll the dice, race your pieces home!</p>
      </div>

      <!-- Setup Screen -->
      <LudoSetup
        v-if="gamePhase === 'setup'"
        v-model:sound-enabled="soundEnabled"
        @start="startGame"
      />

      <!-- Game Screen -->
      <div v-else class="flex flex-col lg:flex-row gap-5">
        <!-- Left Panel -->
        <div class="lg:w-60 shrink-0">
          <LudoSidebar
            :current-player="currentPlayer"
            :players="players"
            :dice-value="diceValue"
            :dice-rolling="diceRolling"
            :can-roll="gamePhase === 'rolling'"
            :is-bot-turn="isBotTurn"
            :is-paused="isPaused"
            :is-over="gamePhase === 'over'"
            :message="message"
            :get-goal-count="goalCount"
            @roll="handleRoll"
            @pause="handlePause"
            @resume="handleResume"
            @reset="handleReset"
          />
        </div>

        <!-- Board -->
        <div class="flex-1 flex justify-center items-start">
          <LudoBoard
            :pieces="renderedPieces"
            :paused="isPaused"
            @piece-click="handlePieceClick"
            @resume="handleResume"
          />
        </div>

        <!-- Right Panel -->
        <div class="lg:w-64 shrink-0">
          <LudoMoveLog :logs="moveLog" :rankings="rankings" />
        </div>
      </div>

      <!-- Game Over Modal -->
      <LudoGameOver
        :visible="gamePhase === 'over'"
        :message="message"
        :final-rankings="allFinalRankings"
        :stats="matchStats"
        @menu="handleReset"
        @play-again="handlePlayAgain"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted, nextTick } from 'vue'
import { useLudoGame, PLAYER_PRESETS, type PlayerConfig } from '../../composables/useLudoGame'
import { useLudoSound } from '../../composables/useLudoSound'
import { getPieceSVGPosition, PIECE_COLORS, STACK_OFFSETS } from '../../utils/ludoBoard'
import { pickBestMove } from '../../utils/ludoBot'
import type { RenderedPiece, MatchStats, PlayerSlot } from '../../utils/ludoTypes'

// ─── Composables ─────────────────────────────────────────────────────────────

const {
  gamePhase, players, currentPlayer, diceValue, diceRolling,
  availableMoves, pieces, rankings, lastPlayer, message, moveLog,
  isPaused, isBotTurn, currentPlayerConfig,
  initGame, performRoll, selectMove,
  pauseGame, resumeGame, resetGame, goalCount,
} = useLudoGame()

const {
  playDiceRoll, playMove, playCapture, playEnter, playGoal,
  playSix, playNoMoves, playClick,
} = useLudoSound()

// ─── Local state ─────────────────────────────────────────────────────────────

const soundEnabled = ref(true)
let lastSlots: PlayerSlot[] = []

// Match stats tracking
const totalMoves = ref(0)
const captureCount = ref(0)
const currentStreak = ref(0)
const highestStreak = ref(0)

const allFinalRankings = computed(() =>
  [...rankings.value, lastPlayer.value].filter(Boolean),
)

const matchStats = computed<MatchStats | null>(() => {
  if (gamePhase.value !== 'over') return null
  return {
    totalMoves: totalMoves.value,
    captures: captureCount.value,
    highestStreak: highestStreak.value,
  }
})

// ─── Rendered pieces (maps game state → SVG positions) ──────────────────────

const renderedPieces = computed<RenderedPiece[]>(() => {
  const result: RenderedPiece[] = []
  const posMap = new Map<string, RenderedPiece[]>()

  for (const p of pieces.value) {
    const [cx, cy] = getPieceSVGPosition(p.name, p.squareIndex, p.index)
    const colors = PIECE_COLORS[p.name] ?? { fill: '#888', stroke: '#555' }

    const moveRef = gamePhase.value === 'choosing'
      ? availableMoves.value.find(m => m.piece.name === p.name && m.piece.index === p.index) ?? null
      : null

    const piece: RenderedPiece = {
      name: p.name, index: p.index, cx, cy,
      fill: colors.fill, stroke: colors.stroke,
      selectable: moveRef !== null, atGoal: p.atGoal, moveRef,
    }

    const key = `${Math.round(cx)},${Math.round(cy)}`
    if (!posMap.has(key)) posMap.set(key, [])
    posMap.get(key)!.push(piece)
  }

  for (const group of posMap.values()) {
    if (group.length === 1) {
      result.push(group[0]!)
    } else {
      group.forEach((p, i) => {
        const [ox, oy] = STACK_OFFSETS[i] ?? [0, 0]
        result.push({ ...p, cx: p.cx + (ox ?? 0), cy: p.cy + (oy ?? 0) })
      })
    }
  }

  return result
})

// ─── Bot timer ───────────────────────────────────────────────────────────────

let botTimer: ReturnType<typeof setTimeout> | null = null

function clearBotTimer() {
  if (botTimer) { clearTimeout(botTimer); botTimer = null }
}

watch(
  [() => gamePhase.value, () => currentPlayer.value],
  ([phase]) => {
    clearBotTimer()
    if (phase === 'rolling' && isBotTurn.value && !isPaused.value) {
      botTimer = setTimeout(executeBotTurn, 800)
    }
  },
  { immediate: true },
)

function executeBotTurn() {
  if (gamePhase.value !== 'rolling' || !isBotTurn.value) return
  sfx('diceRoll')
  diceRolling.value = true

  setTimeout(() => {
    diceRolling.value = false
    performRoll()
    totalMoves.value++
    trackStreak()

    if (gamePhase.value === 'choosing' && availableMoves.value.length > 0) {
      const best = pickBestMove(availableMoves.value)
      sfxForMove(best)
      if (best.capture.length > 0) captureCount.value++
      setTimeout(() => selectMove(best), 500)
    } else {
      sfx('noMoves')
    }
  }, 600)
}

// ─── Human interactions ─────────────────────────────────────────────────────

function handleRoll() {
  if (gamePhase.value !== 'rolling' || isBotTurn.value) return
  sfx('diceRoll')
  diceRolling.value = true

  setTimeout(() => {
    diceRolling.value = false
    performRoll()
    totalMoves.value++
    trackStreak()
    if (diceValue.value === 6) sfx('six')
    if (availableMoves.value.length === 0) sfx('noMoves')
  }, 500)
}

function handlePieceClick(piece: RenderedPiece) {
  if (gamePhase.value !== 'choosing' || !piece.moveRef) return
  sfxForMove(piece.moveRef)
  if (piece.moveRef.capture.length > 0) captureCount.value++
  selectMove(piece.moveRef)
}

function handlePause() {
  clearBotTimer()
  pauseGame()
  sfx('click')
}

function handleResume() {
  resumeGame()
  sfx('click')
}

function handleReset() {
  clearBotTimer()
  resetStats()
  resetGame()
}

function handlePlayAgain() {
  clearBotTimer()
  resetStats()
  resetGame()
  nextTick(() => {
    if (lastSlots.length >= 2) startGame(lastSlots)
  })
}

// ─── Start game ──────────────────────────────────────────────────────────────

function startGame(slots: PlayerSlot[]) {
  lastSlots = slots.map(s => ({ ...s }))

  const configs: PlayerConfig[] = slots.map(s => ({
    id: s.id,
    ...PLAYER_PRESETS[s.id]!,
    isBot: s.type === 'bot',
  }))

  initGame(configs)
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resetStats() {
  totalMoves.value = 0
  captureCount.value = 0
  currentStreak.value = 0
  highestStreak.value = 0
}

function trackStreak() {
  if (diceValue.value === 6) {
    currentStreak.value++
    if (currentStreak.value > highestStreak.value) highestStreak.value = currentStreak.value
  } else {
    currentStreak.value = 0
  }
}

/** Play a sound effect if sound is enabled */
function sfx(name: 'diceRoll' | 'move' | 'capture' | 'enter' | 'goal' | 'six' | 'noMoves' | 'click') {
  if (!soundEnabled.value) return
  const map = { diceRoll: playDiceRoll, move: playMove, capture: playCapture, enter: playEnter, goal: playGoal, six: playSix, noMoves: playNoMoves, click: playClick }
  map[name]()
}

/** Play the appropriate sound for a move */
function sfxForMove(m: { capture: unknown[]; isInitial: boolean; to: { type: string } }) {
  if (m.capture.length > 0) sfx('capture')
  else if (m.isInitial) sfx('enter')
  else if (m.to.type === 'goal') sfx('goal')
  else sfx('move')
}

onUnmounted(() => clearBotTimer())
</script>