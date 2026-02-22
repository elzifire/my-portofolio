<template>
  <section 
    id="home" 
    class="min-h-screen flex items-center justify-center relative overflow-hidden pt-16"
    :class="isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'"
  >
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float" style="animation-delay: 1s;"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary-500/5 to-accent-500/5 rounded-full blur-3xl"></div>
    </div>

    <!-- Floating Particles -->
    <div class="absolute inset-0">
      <div 
        v-for="i in 20" 
        :key="i"
        class="absolute w-2 h-2 rounded-full animate-float"
        :class="isDark ? 'bg-primary-400/30' : 'bg-primary-500/20'"
        :style="{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${3 + Math.random() * 2}s`
        }"
      ></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Text Content -->
        <div class="text-center lg:text-left order-2 lg:order-1">
          <div class="animate-fade-in-up">
            <span 
              class="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6"
              :class="isDark ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-100 text-primary-700'"
            >
              👋 Welcome to my portfolio
            </span>
          </div>
          
          <h1 
            class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up delay-100"
            :class="isDark ? 'text-white' : 'text-gray-900'"
          >
            Hi, I'm
            <span class="gradient-text">Muhammad Ali Ghozi</span>
          </h1>
          
          <h2 
            class="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 animate-fade-in-up delay-200"
            :class="isDark ? 'text-gray-300' : 'text-gray-600'"
          >
            <span class="inline-flex items-center gap-2">
              <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Junior Developer
            </span>
          </h2>
          
          <p 
            class="text-lg mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in-up delay-300"
            :class="isDark ? 'text-gray-400' : 'text-gray-600'"
          >
            Passionate about creating beautiful and functional web applications. 
            I love turning ideas into reality through clean code and creative solutions.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up delay-400">
            <a 
              href="#projects" 
              class="btn-primary px-8 py-4 rounded-full text-white font-semibold inline-flex items-center justify-center gap-2 group"
            >
              View My Work
              <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
            <a 
              href="#contact" 
              class="px-8 py-4 rounded-full font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2"
              :class="isDark 
                ? 'border-2 border-gray-600 text-white hover:border-primary-500 hover:text-primary-400' 
                : 'border-2 border-gray-300 text-gray-700 hover:border-primary-500 hover:text-primary-600'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Contact Me
            </a>
          </div>

          <!-- Social Links -->
          <div class="flex gap-4 mt-8 justify-center lg:justify-start animate-fade-in-up delay-500">
            <a 
              v-for="social in socials" 
              :key="social.name"
              :href="social.url" 
              target="_blank"
              class="p-3 rounded-full transition-all duration-300 group"
              :class="isDark 
                ? 'bg-gray-800 text-gray-400 hover:bg-primary-500 hover:text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-primary-500 hover:text-white'"
              :title="social.name"
            >
              <component :is="social.icon" class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Profile Image -->
        <div class="order-1 lg:order-2 flex justify-center animate-fade-in-right">
          <div class="relative">
            <!-- Decorative Ring -->
            <div class="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 animate-rotate opacity-20" style="padding: 4px;">
              <div class="w-full h-full rounded-full" :class="isDark ? 'bg-gray-900' : 'bg-white'"></div>
            </div>
            
            <!-- Profile Image Container -->
            <div 
              class="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 animate-pulse-glow"
              :class="isDark ? 'border-gray-700' : 'border-white shadow-2xl'"
            >
              <img 
                src="~/assets/images/my-photo2.png" 
                alt="Profile Photo" 
                class="w-full h-full object-cover rounded-full"
                @error="handleImageError"
              />
              <!-- Fallback if image fails -->
              <div 
                v-if="imageError"
                class="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center"
              >
                <span class="text-6xl font-bold text-white">MAG</span>
              </div>
            </div>

            <!-- Floating Badges -->
            <div 
              class="absolute -top-4 -right-4 px-4 py-2 rounded-full shadow-lg animate-float"
              :class="isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'"
            >
              <span class="text-2xl mr-2">💻</span>
              <span class="font-semibold">Developer</span>
            </div>
            
            <div 
              class="absolute -bottom-4 -left-4 px-4 py-2 rounded-full shadow-lg animate-float"
              :class="isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'"
              style="animation-delay: 0.5s;"
            >
              <span class="text-2xl mr-2">🚀</span>
              <span class="font-semibold">Fast Learner</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
      <a href="#about" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
        </svg>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, inject, h, type Ref } from 'vue'

const isDark = inject<Ref<boolean>>('isDark', ref(false))

const imageError = ref(false)

const handleImageError = () => {
  imageError.value = true
}

// Social Icons as functional components
const GitHubIcon = () => h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { d: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' })
])

const LinkedInIcon = () => h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { d: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' })
])

// const TwitterIcon = () => h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
//   h('path', { d: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' })
// ])

const InstagramIcon = () => h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' })
])

const socials = [
  { name: 'GitHub', url: 'https://github.com/elzifire', icon: GitHubIcon },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/ghozi-muhammad-ali-b7943225b', icon: LinkedInIcon },
  // { name: 'Twitter', url: 'https://twitter.com', icon: TwitterIcon },
  { name: 'Instagram', url: 'https://www.instagram.com/elzifire_dg', icon: InstagramIcon }
]
</script>