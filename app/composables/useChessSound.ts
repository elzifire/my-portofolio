/**
 * Chess Sound Effects Composable
 * Handles all sound effects for the chess game
 */

export const useChessSound = () => {
  // Audio context for generating sounds
  let audioContext: AudioContext | null = null

  const getAudioContext = (): AudioContext => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioContext
  }

  // Generate a simple beep sound
  const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) => {
    try {
      const ctx = getAudioContext()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.value = frequency
      oscillator.type = type

      gainNode.gain.setValueAtTime(volume, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + duration)
    } catch (e) {
      console.warn('Sound playback failed:', e)
    }
  }

  // Move sound - short click
  const playMove = () => {
    playTone(800, 0.05, 'square', 0.1)
  }

  // Capture sound - lower thud
  const playCapture = () => {
    playTone(300, 0.1, 'triangle', 0.2)
    setTimeout(() => playTone(250, 0.1, 'triangle', 0.15), 50)
  }

  // Check sound - alert
  const playCheck = () => {
    playTone(600, 0.1, 'sawtooth', 0.15)
    setTimeout(() => playTone(800, 0.15, 'sawtooth', 0.15), 100)
  }

  // Checkmate sound - dramatic
  const playCheckmate = () => {
    playTone(400, 0.2, 'triangle', 0.2)
    setTimeout(() => playTone(500, 0.2, 'triangle', 0.2), 150)
    setTimeout(() => playTone(600, 0.3, 'triangle', 0.25), 300)
  }

  // Game over (stalemate/draw) sound
  const playGameOver = () => {
    playTone(400, 0.15, 'sine', 0.15)
    setTimeout(() => playTone(350, 0.2, 'sine', 0.15), 150)
  }

  // Castle sound - whoosh
  const playCastle = () => {
    playTone(500, 0.05, 'sine', 0.1)
    setTimeout(() => playTone(600, 0.05, 'sine', 0.1), 30)
    setTimeout(() => playTone(700, 0.05, 'sine', 0.1), 60)
  }

  // Promotion sound - ascending
  const playPromotion = () => {
    playTone(500, 0.1, 'sine', 0.15)
    setTimeout(() => playTone(650, 0.1, 'sine', 0.15), 80)
    setTimeout(() => playTone(800, 0.15, 'sine', 0.2), 160)
  }

  // Timer warning (low time)
  const playTimerWarning = () => {
    playTone(1000, 0.05, 'square', 0.1)
  }

  // Timer out
  const playTimerOut = () => {
    playTone(800, 0.3, 'sawtooth', 0.2)
    setTimeout(() => playTone(600, 0.4, 'sawtooth', 0.2), 200)
  }

  // Invalid move
  const playInvalid = () => {
    playTone(200, 0.1, 'square', 0.1)
    setTimeout(() => playTone(150, 0.15, 'square', 0.1), 100)
  }

  return {
    playMove,
    playCapture,
    playCheck,
    playCheckmate,
    playGameOver,
    playCastle,
    playPromotion,
    playTimerWarning,
    playTimerOut,
    playInvalid
  }
}
