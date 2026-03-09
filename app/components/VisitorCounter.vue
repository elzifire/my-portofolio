<template>
  <section class="py-12 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="glass-card rounded-3xl p-8 md:p-12 text-center">
        <span
          class="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
          :class="isDark ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-100 text-primary-700'"
        >
          {{ $t('visitor.tagline') }}
        </span>
        <h2 class="text-2xl sm:text-3xl font-bold mb-8"
          :class="isDark ? 'text-white' : 'text-gray-900'">
          {{ $t('visitor.title') }} <span class="gradient-text">{{ $t('visitor.titleHighlight') }}</span>
        </h2>

        <div class="flex flex-wrap justify-center gap-8">
          <!-- Total Visits -->
          <div class="glass-card rounded-2xl p-6 min-w-[160px]">
            <div class="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
              :class="isDark ? 'bg-primary-500/20' : 'bg-primary-100'">
              <svg class="w-6 h-6" :class="isDark ? 'text-primary-400' : 'text-primary-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <p class="text-3xl font-bold gradient-text counter-animate">{{ animatedVisits }}</p>
            <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">{{ $t('visitor.totalVisits') }}</p>
          </div>

          <!-- Current Time -->
          <div class="glass-card rounded-2xl p-6 min-w-[160px]">
            <div class="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
              :class="isDark ? 'bg-accent-500/20' : 'bg-accent-100'">
              <svg class="w-6 h-6" :class="isDark ? 'text-accent-400' : 'text-accent-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-3xl font-bold gradient-text">{{ currentTime }}</p>
            <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Local Time</p>
          </div>

          <!-- Status -->
          <div class="glass-card rounded-2xl p-6 min-w-[160px]">
            <div class="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center bg-green-500/20">
              <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <p class="text-3xl font-bold text-green-500">Online</p>
            <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Status</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject, type Ref } from 'vue'

const isDark = inject<Ref<boolean>>('isDark', ref(false))
const visits = ref(0)
const animatedVisits = ref(0)
const currentTime = ref('')

let timeInterval: ReturnType<typeof setInterval> | null = null

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false 
  })
}

const animateCounter = (target: number) => {
  const duration = 1500
  const steps = 60
  const increment = target / steps
  let current = 0
  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      animatedVisits.value = target
      clearInterval(timer)
    } else {
      animatedVisits.value = Math.floor(current)
    }
  }, duration / steps)
}

onMounted(() => {
  // Simple localStorage-based counter
  const stored = localStorage.getItem('portfolioVisits')
  const count = stored ? parseInt(stored) + 1 : 1
  localStorage.setItem('portfolioVisits', count.toString())
  visits.value = count
  animateCounter(count)
  
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})
</script>
