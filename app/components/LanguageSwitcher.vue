<template>
  <div class="relative">
    <button 
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 text-sm font-medium"
      :class="isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
    >
      <span class="text-base">{{ currentFlag }}</span>
      <span class="hidden sm:inline">{{ currentLabel }}</span>
      <svg class="w-3 h-3 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div 
        v-if="isOpen"
        class="absolute right-0 mt-2 w-44 rounded-xl shadow-lg glass-card overflow-hidden z-50"
      >
        <button 
          v-for="locale in locales" 
          :key="locale.code"
          @click="switchLocale(locale.code)"
          class="w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200"
          :class="[
            currentLocale === locale.code 
              ? 'bg-primary-500/20 text-primary-500 font-semibold' 
              : isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-black/5'
          ]"
        >
          <span class="text-lg">{{ locale.flag }}</span>
          <span>{{ locale.name }}</span>
          <svg v-if="currentLocale === locale.code" class="w-4 h-4 ml-auto text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, onMounted, onUnmounted, type Ref } from 'vue'

const { locale, setLocale } = useI18n()
const isDark = inject<Ref<boolean>>('isDark', ref(false))
const isOpen = ref(false)

const locales = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' }
]

const currentLocale = computed(() => locale.value)
const currentFlag = computed(() => locales.find(l => l.code === locale.value)?.flag || '🌐')
const currentLabel = computed(() => locales.find(l => l.code === locale.value)?.name || '')

const switchLocale = (code: string) => {
  setLocale(code)
  isOpen.value = false
}

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.relative')) isOpen.value = false
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>
