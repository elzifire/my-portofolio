import { describe, it, expect, vi, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

const mockSetLocale = vi.fn()

// Stub the Nuxt auto-import useI18n globally before component import
vi.stubGlobal('useI18n', () => ({
  locale: ref('en'),
  setLocale: mockSetLocale,
}))

import LanguageSwitcher from '../../app/components/LanguageSwitcher.vue'

describe('LanguageSwitcher', () => {
  const createWrapper = () => {
    return mount(LanguageSwitcher, {
      global: {
        provide: {
          isDark: ref(false),
        },
      },
    })
  }

  it('should render the component', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('should display current locale flag', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('English')
  })
})
