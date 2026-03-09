import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'

// Mock lifecycle hooks so type() gets called immediately
vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')
  return {
    ...actual,
    onMounted: (fn: () => void) => fn(),
    onUnmounted: vi.fn(),
  }
})

import { useTypewriter } from '../../app/composables/useTypewriter'

describe('useTypewriter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should type the first character after typing speed interval', () => {
    const { displayText } = useTypewriter(['Hello'], 50, 30, 1000)
    // onMounted mock calls type() immediately which types 'H' and schedules next at 50ms
    expect(displayText.value).toBe('H')
    vi.advanceTimersByTime(50)
    expect(displayText.value).toBe('He')
  })

  it('should type the full word', () => {
    const { displayText } = useTypewriter(['Hi'], 50, 30, 1000)
    // Initial call types 'H', then 50ms later types 'i'
    vi.advanceTimersByTime(50)
    expect(displayText.value).toBe('Hi')
  })

  it('should start deleting after pause', () => {
    const { displayText } = useTypewriter(['Hi'], 50, 30, 100)
    // t=0 (onMounted): types 'H', schedules +50ms
    // t=50: types 'Hi', charIndex===length → isDeleting=true, schedules +100ms (pause)
    // t=150: deletes to 'H', schedules +30ms
    vi.advanceTimersByTime(50)
    expect(displayText.value).toBe('Hi')
    vi.advanceTimersByTime(100) // after pause, deletes one char
    expect(displayText.value).toBe('H')
  })
})
