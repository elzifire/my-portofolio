import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { useTilt3D } from '../../app/composables/useTilt3D'

// Mock onMounted/onUnmounted since we're testing outside Vue component context
vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')
  return {
    ...actual,
    onMounted: (fn: () => void) => fn(),
    onUnmounted: vi.fn(),
  }
})

describe('useTilt3D', () => {
  it('should return initial values of 0', () => {
    const el = ref(null)
    const { rotateX, rotateY } = useTilt3D(el)
    expect(rotateX.value).toBe(0)
    expect(rotateY.value).toBe(0)
  })

  it('should update rotation on mousemove', () => {
    const div = document.createElement('div')
    Object.defineProperty(div, 'getBoundingClientRect', {
      value: () => ({
        left: 0,
        top: 0,
        width: 200,
        height: 200,
        right: 200,
        bottom: 200,
      }),
    })
    const el = ref(div) as any
    const { rotateX, rotateY } = useTilt3D(el)

    // Simulate mouse in top-right corner
    div.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 200, clientY: 0 })
    )

    expect(rotateY.value).toBe(10) // far right
    expect(rotateX.value).toBe(10) // top
  })

  it('should reset rotation on mouseleave', () => {
    const div = document.createElement('div')
    Object.defineProperty(div, 'getBoundingClientRect', {
      value: () => ({
        left: 0, top: 0, width: 200, height: 200, right: 200, bottom: 200,
      }),
    })
    const el = ref(div) as any
    const { rotateX, rotateY } = useTilt3D(el)

    div.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 200, clientY: 0 })
    )
    expect(rotateX.value).not.toBe(0)

    div.dispatchEvent(new MouseEvent('mouseleave'))
    expect(rotateX.value).toBe(0)
    expect(rotateY.value).toBe(0)
  })
})
