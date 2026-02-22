<template>
  <footer 
    class="relative overflow-hidden"
    :class="isDark ? 'bg-gray-900' : 'bg-gray-900'"
  >
    <!-- Gradient Top Border -->
    <div class="section-divider"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid md:grid-cols-3 gap-8 mb-8">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <svg class="w-8 h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="url(#footerLogoGrad)"/>
              <path d="M12 28V12L20 20L28 12V28" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <defs>
                <linearGradient id="footerLogoGrad" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stop-color="#3b82f6"/>
                  <stop offset="100%" stop-color="#8b5cf6"/>
                </linearGradient>
              </defs>
            </svg>
            <span class="text-xl font-bold text-white">Portfolio</span>
          </div>
          <p class="text-gray-400 text-sm leading-relaxed max-w-xs">
            A passionate Junior Developer building beautiful and functional web experiences. 
            Always learning, always growing.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-white font-semibold mb-4">Quick Links</h3>
          <nav class="space-y-2">
            <a 
              v-for="link in quickLinks" 
              :key="link.label" 
              :href="link.href"
              class="block text-gray-400 hover:text-primary-400 transition-colors duration-300 text-sm"
            >
              {{ link.label }}
            </a>
          </nav>
        </div>

        <!-- Tech Stack -->
        <div>
          <h3 class="text-white font-semibold mb-4">Built With</h3>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="tech in builtWith" 
              :key="tech"
              class="px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700"
            >
              {{ tech }}
            </span>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-gray-500 text-sm">
          &copy; {{ currentYear }} Portfolio. All rights reserved.
        </p>

        <!-- Back to Top -->
        <button 
          @click="scrollToTop"
          class="flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors duration-300 text-sm group"
        >
          Back to top
          <svg class="w-4 h-4 transition-transform group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
          </svg>
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, inject, type Ref } from 'vue'

const isDark = inject<Ref<boolean>>('isDark', ref(false))

const currentYear = new Date().getFullYear()

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' }
]

const builtWith = ['Nuxt.js', 'Vue.js', 'Tailwind CSS', 'TypeScript']

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
