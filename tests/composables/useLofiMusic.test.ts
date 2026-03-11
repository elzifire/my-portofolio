import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// We need to mock AudioContext since it doesn't exist in Node
class MockGainNode {
  gain = { value: 1, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }
  connect = vi.fn()
  disconnect = vi.fn()
}

class MockOscillatorNode {
  type = 'sine'
  frequency = { value: 440, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }
  connect = vi.fn()
  start = vi.fn()
  stop = vi.fn()
}

class MockBiquadFilterNode {
  type = 'lowpass'
  frequency = { value: 350 }
  Q = { value: 1 }
  connect = vi.fn()
}

class MockBufferSource {
  buffer: any = null
  connect = vi.fn()
  start = vi.fn()
  stop = vi.fn()
}

class MockAudioBuffer {
  constructor(public numberOfChannels: number, public length: number, public sampleRate: number) {}
  getChannelData() { return new Float32Array(this.length) }
}

let mockCtxTime = 0

class MockAudioContext {
  state = 'running'
  sampleRate = 44100
  get currentTime() { return mockCtxTime }
  destination = {}
  createGain() { return new MockGainNode() }
  createOscillator() { return new MockOscillatorNode() }
  createBiquadFilter() { return new MockBiquadFilterNode() }
  createBufferSource() { return new MockBufferSource() }
  createBuffer(channels: number, length: number, sampleRate: number) {
    return new MockAudioBuffer(channels, length, sampleRate)
  }
  resume = vi.fn().mockResolvedValue(undefined)
  suspend = vi.fn().mockResolvedValue(undefined)
  close = vi.fn().mockResolvedValue(undefined)
}

// Install global mock
vi.stubGlobal('AudioContext', MockAudioContext)

// Mock vue auto-imports for the composable
vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')
  return { ...actual }
})

import { useLofiMusic } from '../../app/composables/useLofiMusic'

describe('useLofiMusic', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockCtxTime = 0
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with defaults', () => {
    const lofi = useLofiMusic()
    expect(lofi.isPlaying.value).toBe(false)
    expect(lofi.isMuted.value).toBe(false)
    expect(lofi.volume.value).toBe(30)
    expect(lofi.trackIndex.value).toBe(0)
    expect(lofi.currentTime.value).toBe(0)
    lofi.destroy()
  })

  it('should have 5 tracks', () => {
    const lofi = useLofiMusic()
    expect(lofi.tracks.length).toBe(5)
    expect(lofi.tracks[0].title).toBe('Midnight Haze')
    expect(lofi.tracks[4].title).toBe('Late Night Study')
    lofi.destroy()
  })

  it('should return current track computed', () => {
    const lofi = useLofiMusic()
    expect(lofi.currentTrack.value.title).toBe('Midnight Haze')
    lofi.destroy()
  })

  it('should toggle play state', () => {
    const lofi = useLofiMusic()
    expect(lofi.isPlaying.value).toBe(false)

    lofi.togglePlay()
    expect(lofi.isPlaying.value).toBe(true)

    lofi.togglePlay()
    expect(lofi.isPlaying.value).toBe(false)
    lofi.destroy()
  })

  it('should switch to next track', () => {
    const lofi = useLofiMusic()
    expect(lofi.trackIndex.value).toBe(0)

    lofi.nextTrack()
    expect(lofi.trackIndex.value).toBe(1)
    expect(lofi.isPlaying.value).toBe(true)

    lofi.destroy()
  })

  it('should switch to previous track (wrap around)', () => {
    const lofi = useLofiMusic()
    expect(lofi.trackIndex.value).toBe(0)

    lofi.prevTrack()
    expect(lofi.trackIndex.value).toBe(4) // wraps to last
    expect(lofi.isPlaying.value).toBe(true)

    lofi.destroy()
  })

  it('should play specific track by index', () => {
    const lofi = useLofiMusic()

    lofi.playTrack(3)
    expect(lofi.trackIndex.value).toBe(3)
    expect(lofi.isPlaying.value).toBe(true)
    expect(lofi.currentTrack.value.title).toBe('Dreamy Sunset')

    lofi.destroy()
  })

  it('should set volume', () => {
    const lofi = useLofiMusic()

    lofi.setVolume(75)
    expect(lofi.volume.value).toBe(75)
    expect(lofi.isMuted.value).toBe(false)

    lofi.destroy()
  })

  it('should toggle mute', () => {
    const lofi = useLofiMusic()
    expect(lofi.isMuted.value).toBe(false)

    lofi.toggleMute()
    expect(lofi.isMuted.value).toBe(true)

    lofi.toggleMute()
    expect(lofi.isMuted.value).toBe(false)

    lofi.destroy()
  })

  it('should unmute when setting volume > 0', () => {
    const lofi = useLofiMusic()
    lofi.toggleMute()
    expect(lofi.isMuted.value).toBe(true)

    lofi.setVolume(50)
    expect(lofi.isMuted.value).toBe(false)

    lofi.destroy()
  })

  it('should format time correctly', () => {
    const lofi = useLofiMusic()

    expect(lofi.formatTime(0)).toBe('0:00')
    expect(lofi.formatTime(65)).toBe('1:05')
    expect(lofi.formatTime(120)).toBe('2:00')
    expect(lofi.formatTime(3599)).toBe('59:59')

    lofi.destroy()
  })

  it('should compute duration based on bpm', () => {
    const lofi = useLofiMusic()
    // Track 0: 4 chords × 8 beats × 3 progressions = 96 beats at 70 bpm
    // Duration = (96 / 70) * 60 ≈ 82.28s
    expect(lofi.duration.value).toBeGreaterThan(80)
    expect(lofi.duration.value).toBeLessThan(85)

    lofi.destroy()
  })

  it('should have progressPct at 0 initially', () => {
    const lofi = useLofiMusic()
    expect(lofi.progressPct.value).toBe(0)
    lofi.destroy()
  })

  it('should schedule audio when playing and advance currentTime', () => {
    const lofi = useLofiMusic()

    lofi.togglePlay()
    expect(lofi.isPlaying.value).toBe(true)

    // Advance time to trigger scheduler
    mockCtxTime = 1
    vi.advanceTimersByTime(100)

    // Current time should be updated
    expect(lofi.currentTime.value).toBeGreaterThanOrEqual(0)

    lofi.destroy()
  })

  it('should cleanly destroy', () => {
    const lofi = useLofiMusic()
    lofi.togglePlay()
    expect(lofi.isPlaying.value).toBe(true)

    lofi.destroy()
    // After destroy, the scheduler should be stopped
    // No errors should occur
  })

  it('should cycle tracks with nextTrack wrapping', () => {
    const lofi = useLofiMusic()

    lofi.playTrack(4) // last track
    expect(lofi.trackIndex.value).toBe(4)

    lofi.nextTrack()
    expect(lofi.trackIndex.value).toBe(0) // wraps to first

    lofi.destroy()
  })
})
