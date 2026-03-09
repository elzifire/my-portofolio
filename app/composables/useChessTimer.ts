/**
 * Chess Timer Composable
 * Handles countdown timers for chess games.
 *
 * FIX: the active mode is now stored in a reactive ref so that
 *      `preset` (and therefore increment) always reflects the
 *      mode chosen by the player — not the one passed at setup time.
 */

import { ref, computed, onUnmounted } from 'vue'

export type TimerMode = 'none' | 'bullet' | 'blitz' | 'rapid' | 'classical'

export interface TimerPreset {
  name: string
  minutes: number
  increment: number // seconds added per move
}

export const TIMER_PRESETS: Record<TimerMode, TimerPreset> = {
  none: { name: 'No Timer', minutes: 0, increment: 0 },
  bullet: { name: 'Bullet (1+0)', minutes: 1, increment: 0 },
  blitz: { name: 'Blitz (3+2)', minutes: 3, increment: 2 },
  rapid: { name: 'Rapid (10+5)', minutes: 10, increment: 5 },
  classical: { name: 'Classical (30+0)', minutes: 30, increment: 0 },
}

export const useChessTimer = () => {
  // ── State ──
  const currentMode = ref<TimerMode>('none')
  const whiteTime = ref(0) // milliseconds
  const blackTime = ref(0)
  const currentTurn = ref<'w' | 'b'>('w')
  const isRunning = ref(false)
  const isExpired = ref(false)

  let intervalId: ReturnType<typeof setInterval> | null = null
  let lastTickTime = 0

  /** Reactive preset that always follows `currentMode` */
  const preset = computed(() => TIMER_PRESETS[currentMode.value])

  // ── Formatting ──
  const formatTime = (ms: number): string => {
    if (ms <= 0) return '0:00'
    const totalSeconds = Math.ceil(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const whiteTimeDisplay = computed(() => formatTime(whiteTime.value))
  const blackTimeDisplay = computed(() => formatTime(blackTime.value))
  const isWhiteLowTime = computed(() => whiteTime.value > 0 && whiteTime.value < 30000)
  const isBlackLowTime = computed(() => blackTime.value > 0 && blackTime.value < 30000)

  // ── Controls ──
  const initTimer = (timerMode: TimerMode) => {
    currentMode.value = timerMode
    const p = TIMER_PRESETS[timerMode]

    if (p.minutes === 0) {
      whiteTime.value = 0
      blackTime.value = 0
      stopTimer()
      return
    }

    whiteTime.value = p.minutes * 60 * 1000
    blackTime.value = p.minutes * 60 * 1000
    currentTurn.value = 'w'
    isExpired.value = false
  }

  const startTimer = () => {
    if (preset.value.minutes === 0 || isRunning.value) return

    isRunning.value = true
    lastTickTime = Date.now()

    intervalId = setInterval(() => {
      const now = Date.now()
      const elapsed = now - lastTickTime
      lastTickTime = now

      if (currentTurn.value === 'w') {
        whiteTime.value = Math.max(0, whiteTime.value - elapsed)
        if (whiteTime.value <= 0) { isExpired.value = true; stopTimer() }
      } else {
        blackTime.value = Math.max(0, blackTime.value - elapsed)
        if (blackTime.value <= 0) { isExpired.value = true; stopTimer() }
      }
    }, 100)
  }

  const stopTimer = () => {
    isRunning.value = false
    if (intervalId) { clearInterval(intervalId); intervalId = null }
  }

  /** Switch turn and add the increment for the player who just moved */
  const switchTurn = () => {
    const increment = preset.value.increment * 1000
    if (currentTurn.value === 'w') {
      whiteTime.value += increment
      currentTurn.value = 'b'
    } else {
      blackTime.value += increment
      currentTurn.value = 'w'
    }
  }

  const getTimeoutWinner = (): 'w' | 'b' | null => {
    if (!isExpired.value) return null
    return whiteTime.value <= 0 ? 'b' : 'w'
  }

  const resetTimer = () => {
    stopTimer()
    initTimer(currentMode.value)
  }

  onUnmounted(() => { stopTimer() })

  return {
    whiteTime, blackTime, whiteTimeDisplay, blackTimeDisplay,
    currentTurn, isRunning, isExpired, isWhiteLowTime, isBlackLowTime,
    preset, initTimer, startTimer, stopTimer, switchTurn,
    getTimeoutWinner, resetTimer, formatTime,
  }
}
