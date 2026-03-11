/**
 * Procedural lofi/chill music generator using the Web Audio API.
 * Generates ambient chord progressions with soft pads and a gentle beat.
 * No external audio files needed — everything is synthesized in the browser.
 */

import { ref, computed } from 'vue'

interface LofiTrack {
  title: string
  artist: string
  /** Musical key expressed as a base frequency multiplier index */
  chords: number[][]
  bpm: number
}

const TRACKS: LofiTrack[] = [
  {
    title: 'Midnight Haze',
    artist: 'Synth Lofi',
    // Cmaj7 → Am7 → Fmaj7 → G7
    chords: [
      [261.63, 329.63, 392.00, 493.88],
      [220.00, 261.63, 329.63, 392.00],
      [174.61, 220.00, 261.63, 329.63],
      [196.00, 246.94, 293.66, 349.23],
    ],
    bpm: 70,
  },
  {
    title: 'Rainy Window',
    artist: 'Synth Lofi',
    // Dm9 → G13 → Cmaj9 → Am11
    chords: [
      [146.83, 174.61, 220.00, 261.63],
      [196.00, 246.94, 329.63, 349.23],
      [261.63, 329.63, 392.00, 493.88],
      [220.00, 261.63, 329.63, 392.00],
    ],
    bpm: 65,
  },
  {
    title: 'Coffee & Code',
    artist: 'Synth Lofi',
    // Fmaj7 → Em7 → Dm7 → Cmaj7
    chords: [
      [174.61, 220.00, 261.63, 329.63],
      [164.81, 196.00, 246.94, 293.66],
      [146.83, 174.61, 220.00, 261.63],
      [130.81, 164.81, 196.00, 246.94],
    ],
    bpm: 72,
  },
  {
    title: 'Dreamy Sunset',
    artist: 'Synth Lofi',
    // Bbmaj7 → Gm7 → Ebmaj7 → F7
    chords: [
      [233.08, 293.66, 349.23, 440.00],
      [196.00, 233.08, 293.66, 349.23],
      [155.56, 196.00, 233.08, 293.66],
      [174.61, 220.00, 261.63, 329.63],
    ],
    bpm: 68,
  },
  {
    title: 'Late Night Study',
    artist: 'Synth Lofi',
    // Am7 → Dm7 → G7 → Cmaj7
    chords: [
      [220.00, 261.63, 329.63, 392.00],
      [146.83, 174.61, 220.00, 261.63],
      [196.00, 246.94, 293.66, 349.23],
      [261.63, 329.63, 392.00, 493.88],
    ],
    bpm: 66,
  },
]

export function useLofiMusic() {
  let ctx: AudioContext | null = null
  let masterGain: GainNode | null = null
  let schedulerTimer: ReturnType<typeof setInterval> | null = null
  let nextNoteTime = 0
  let currentChordIndex = 0
  let beatInChord = 0
  const BEATS_PER_CHORD = 8

  const isPlaying = ref(false)
  const isMuted = ref(false)
  const volume = ref(30)
  const trackIndex = ref(0)
  const currentTime = ref(0)
  const elapsed = ref(0)

  const tracks = TRACKS
  const currentTrack = computed(() => tracks[trackIndex.value])

  // We simulate a ~2-minute loop per track
  const duration = computed(() => {
    const t = currentTrack.value
    const beatsPerLoop = t.chords.length * BEATS_PER_CHORD * 3 // 3 full progressions
    return (beatsPerLoop / t.bpm) * 60
  })

  const progressPct = computed(() =>
    duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
  )

  function ensureCtx() {
    if (!ctx) {
      ctx = new AudioContext()
      masterGain = ctx.createGain()
      masterGain.gain.value = volume.value / 100
      masterGain.connect(ctx.destination)
    }
    if (ctx.state === 'suspended') ctx.resume()
  }

  function playPad(freq: number, startTime: number, dur: number) {
    if (!ctx || !masterGain) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    osc.type = 'sine'
    osc.frequency.value = freq

    filter.type = 'lowpass'
    filter.frequency.value = 800 + Math.random() * 400
    filter.Q.value = 1

    gain.gain.setValueAtTime(0, startTime)
    gain.gain.linearRampToValueAtTime(0.06, startTime + 0.3)
    gain.gain.setValueAtTime(0.06, startTime + dur - 0.4)
    gain.gain.linearRampToValueAtTime(0, startTime + dur)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(masterGain)

    osc.start(startTime)
    osc.stop(startTime + dur)
  }

  function playKick(startTime: number) {
    if (!ctx || !masterGain) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(150, startTime)
    osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.15)

    gain.gain.setValueAtTime(0.3, startTime)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3)

    osc.connect(gain)
    gain.connect(masterGain)

    osc.start(startTime)
    osc.stop(startTime + 0.3)
  }

  function playHihat(startTime: number, accent: boolean) {
    if (!ctx || !masterGain) return

    const bufferSize = ctx.sampleRate * 0.05
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = 7000

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(accent ? 0.08 : 0.04, startTime)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.06)

    source.connect(filter)
    filter.connect(gain)
    gain.connect(masterGain)

    source.start(startTime)
    source.stop(startTime + 0.06)
  }

  function scheduleBeat() {
    if (!ctx) return
    const track = currentTrack.value
    const beatDuration = 60 / track.bpm
    const chordDuration = BEATS_PER_CHORD * beatDuration

    // Play chord pad on first beat of chord
    if (beatInChord === 0) {
      const chord = track.chords[currentChordIndex % track.chords.length]
      for (const freq of chord) {
        playPad(freq, nextNoteTime, chordDuration)
        // Add a subtle detuned doubling for warmth
        playPad(freq * 1.002, nextNoteTime, chordDuration)
      }
      // Bass note (one octave down)
      playPad(chord[0] / 2, nextNoteTime, chordDuration)
    }

    // Kick on beats 0, 4
    if (beatInChord % 4 === 0) {
      playKick(nextNoteTime)
    }

    // Hi-hat on every beat, accent on offbeats
    playHihat(nextNoteTime, beatInChord % 2 === 1)

    // Advance
    nextNoteTime += beatDuration
    beatInChord++
    if (beatInChord >= BEATS_PER_CHORD) {
      beatInChord = 0
      currentChordIndex++
    }
  }

  function startScheduler() {
    if (schedulerTimer) return
    ensureCtx()
    if (!ctx) return

    nextNoteTime = ctx.currentTime + 0.1
    currentChordIndex = 0
    beatInChord = 0
    const startCtxTime = ctx.currentTime

    schedulerTimer = setInterval(() => {
      if (!ctx || !isPlaying.value) return
      // Schedule ahead
      while (nextNoteTime < ctx.currentTime + 0.2) {
        scheduleBeat()

        // Loop the track
        const totalBeats = currentTrack.value.chords.length * BEATS_PER_CHORD * 3
        if (currentChordIndex * BEATS_PER_CHORD + beatInChord >= totalBeats) {
          currentChordIndex = 0
          beatInChord = 0
        }
      }
      // Update elapsed
      elapsed.value = ctx.currentTime - startCtxTime
      currentTime.value = elapsed.value % duration.value
    }, 50)
  }

  function stopScheduler() {
    if (schedulerTimer) {
      clearInterval(schedulerTimer)
      schedulerTimer = null
    }
  }

  function togglePlay() {
    if (isPlaying.value) {
      isPlaying.value = false
      stopScheduler()
      ctx?.suspend()
    } else {
      isPlaying.value = true
      startScheduler()
    }
  }

  function playTrackAt(i: number) {
    stopScheduler()
    if (ctx) {
      ctx.close()
      ctx = null
      masterGain = null
    }
    trackIndex.value = i
    elapsed.value = 0
    currentTime.value = 0
    isPlaying.value = true
    startScheduler()
  }

  function nextTrackFn() {
    playTrackAt((trackIndex.value + 1) % tracks.length)
  }

  function prevTrackFn() {
    playTrackAt((trackIndex.value - 1 + tracks.length) % tracks.length)
  }

  function setVolumeFn(val: number) {
    volume.value = val
    if (masterGain) masterGain.gain.value = val / 100
    if (val > 0) isMuted.value = false
  }

  function toggleMute() {
    isMuted.value = !isMuted.value
    if (masterGain) {
      masterGain.gain.value = isMuted.value ? 0 : volume.value / 100
    }
  }

  function destroy() {
    stopScheduler()
    if (ctx) {
      ctx.close()
      ctx = null
      masterGain = null
    }
  }

  return {
    tracks,
    currentTrack,
    trackIndex,
    isPlaying,
    isMuted,
    volume,
    currentTime,
    duration,
    progressPct,
    togglePlay,
    playTrack: playTrackAt,
    nextTrack: nextTrackFn,
    prevTrack: prevTrackFn,
    setVolume: setVolumeFn,
    toggleMute,
    destroy,
    formatTime(s: number): string {
      const m = Math.floor(s / 60)
      const sec = Math.floor(s % 60)
      return `${m}:${sec.toString().padStart(2, '0')}`
    },
  }
}
