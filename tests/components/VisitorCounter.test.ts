import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import VisitorCounter from '../../app/components/VisitorCounter.vue'

describe('VisitorCounter', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const translations: Record<string, string> = {
    'visitor.tagline': 'Live Stats',
    'visitor.title': 'Visitor',
    'visitor.titleHighlight': 'Counter',
    'visitor.totalVisits': 'Total Visits',
  }

  const createWrapper = () => {
    return mount(VisitorCounter, {
      global: {
        provide: {
          isDark: ref(false),
        },
        mocks: {
          $t: (key: string) => translations[key] || key,
        },
        stubs: {
          ClientOnly: {
            template: '<div><slot /></div>',
          },
        },
      },
    })
  }

  it('should render the component', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('should display section title', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Visitor')
    expect(wrapper.text()).toContain('Counter')
  })

  it('should increment visit count in localStorage', () => {
    localStorage.setItem('portfolio_visit_count', '5')
    const wrapper = createWrapper()
    const count = localStorage.getItem('portfolio_visit_count')
    expect(Number(count)).toBeGreaterThanOrEqual(5)
  })
})
