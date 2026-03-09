/**
 * Ludo Sound Effects Composable
 * All sounds are synthesized via Web Audio API — no external files needed.
 */

export const useLudoSound = () => {
  let ctx: AudioContext | null = null

  const getCtx = (): AudioContext => {
    if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    return ctx
  }

  const tone = (freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.25) => {
    try {
      const c = getCtx()
      const osc = c.createOscillator()
      const gain = c.createGain()
      osc.connect(gain)
      gain.connect(c.destination)
      osc.frequency.value = freq
      osc.type = type
      gain.gain.setValueAtTime(vol, c.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + dur)
      osc.start(c.currentTime)
      osc.stop(c.currentTime + dur)
    } catch { /* silent fail */ }
  }

  /** Dice roll — short rattle effect */
  const playDiceRoll = () => {
    for (let i = 0; i < 6; i++) {
      setTimeout(() => tone(300 + Math.random() * 400, 0.04, 'square', 0.08), i * 30)
    }
  }

  /** Piece moves on the board */
  const playMove = () => tone(600, 0.06, 'triangle', 0.12)

  /** Piece captures another */
  const playCapture = () => {
    tone(250, 0.12, 'sawtooth', 0.18)
    setTimeout(() => tone(200, 0.15, 'sawtooth', 0.14), 80)
  }

  /** Piece enters the board from home */
  const playEnter = () => {
    tone(500, 0.08, 'sine', 0.12)
    setTimeout(() => tone(700, 0.1, 'sine', 0.14), 60)
  }

  /** A piece reaches the goal */
  const playGoal = () => {
    tone(600, 0.15, 'triangle', 0.18)
    setTimeout(() => tone(750, 0.15, 'triangle', 0.18), 120)
    setTimeout(() => tone(900, 0.2, 'triangle', 0.22), 240)
  }

  /** A player finishes (all 4 pieces at goal) */
  const playFinish = () => {
    tone(500, 0.2, 'sine', 0.2)
    setTimeout(() => tone(600, 0.2, 'sine', 0.2), 150)
    setTimeout(() => tone(700, 0.2, 'sine', 0.2), 300)
    setTimeout(() => tone(900, 0.3, 'sine', 0.25), 450)
  }

  /** Game over */
  const playGameOver = () => {
    tone(400, 0.15, 'triangle', 0.15)
    setTimeout(() => tone(350, 0.2, 'triangle', 0.12), 150)
    setTimeout(() => tone(300, 0.3, 'triangle', 0.1), 300)
  }

  /** Dice rolled a 6 — exciting! */
  const playSix = () => {
    tone(800, 0.08, 'square', 0.1)
    setTimeout(() => tone(1000, 0.1, 'square', 0.12), 60)
  }

  /** No valid moves available */
  const playNoMoves = () => {
    tone(200, 0.1, 'square', 0.08)
    setTimeout(() => tone(150, 0.12, 'square', 0.08), 80)
  }

  /** Pause / resume click */
  const playClick = () => tone(500, 0.03, 'sine', 0.08)

  return {
    playDiceRoll, playMove, playCapture, playEnter, playGoal,
    playFinish, playGameOver, playSix, playNoMoves, playClick,
  }
}
