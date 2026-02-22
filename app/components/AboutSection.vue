<template>
  <section 
    id="about" 
    class="py-20 lg:py-32 relative overflow-hidden"
    :class="isDark ? 'bg-gray-800' : 'bg-white'"
  >
    <!-- Background Decoration -->
    <div class="absolute top-0 right-0 w-1/2 h-full opacity-5">
      <svg viewBox="0 0 200 200" class="w-full h-full">
        <path 
          fill="currentColor" 
          :class="isDark ? 'text-primary-400' : 'text-primary-600'"
          d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.2C64.8,55.2,53.8,66.6,40.5,74.5C27.2,82.4,11.6,86.8,-3.8,91.4C-19.2,96,-34.6,100.8,-47.3,95.8C-60,90.8,-70,76,-77.2,60.4C-84.4,44.8,-88.8,28.4,-89.5,11.6C-90.2,-5.2,-87.2,-22.4,-79.6,-37.1C-72,-51.8,-59.8,-64,-45.5,-71.7C-31.2,-79.4,-14.8,-82.6,0.8,-83.9C16.3,-85.2,32.6,-84.6,44.7,-76.4Z" 
          transform="translate(100 100)"
        />
      </svg>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <span 
          class="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 animate-fade-in-up"
          :class="isDark ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-100 text-primary-700'"
        >
          Get to know me
        </span>
        <h2 
          class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in-up delay-100"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          About <span class="gradient-text">Me</span>
        </h2>
        <div class="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full"></div>
      </div>

      <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <!-- Image Side -->
        <div class="relative animate-fade-in-left">
          <div class="relative">
            <!-- Main Image -->
            <div 
              class="relative rounded-2xl overflow-hidden shadow-2xl"
              :class="isDark ? 'bg-gray-700' : 'bg-gray-100'"
            >
              <img 
                src="~/assets/images/my-photo.png" 
                alt="About Me" 
                class="w-full h-auto object-cover"
                @error="handleImageError"
              />
              <div 
                v-if="imageError"
                class="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center min-h-[400px]"
              >
                <div class="text-center text-white">
                  <svg class="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  <span class="text-xl font-semibold">Junior Developer</span>
                </div>
              </div>
            </div>

            <!-- Experience Badge -->
            <div 
              class="absolute -bottom-6 -right-6 px-6 py-4 rounded-2xl shadow-xl animate-float"
              :class="isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'"
            >
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-2xl font-bold">1+</p>
                  <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Years Learning</p>
                </div>
              </div>
            </div>

            <!-- Projects Badge -->
            <div 
              class="absolute -top-6 -left-6 px-6 py-4 rounded-2xl shadow-xl animate-float"
              :class="isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'"
              style="animation-delay: 0.5s;"
            >
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-gradient-to-r from-accent-500 to-primary-500 flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-2xl font-bold">5+</p>
                  <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Projects</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Content Side -->
        <div class="animate-fade-in-right">
          <h3 
            class="text-2xl font-bold mb-6"
            :class="isDark ? 'text-white' : 'text-gray-900'"
          >
            A passionate Junior Developer based in Indonesia
          </h3>
          
          <p 
            class="text-lg mb-6 leading-relaxed"
            :class="isDark ? 'text-gray-300' : 'text-gray-600'"
          >
            Hello! I'm a junior developer with a strong passion for web development and technology. 
            I enjoy creating beautiful, functional, and user-friendly websites and applications.
          </p>
          
          <p 
            class="text-lg mb-8 leading-relaxed"
            :class="isDark ? 'text-gray-300' : 'text-gray-600'"
          >
            My journey in programming started with curiosity and has grown into a genuine love for 
            solving problems through code. I'm constantly learning new technologies and improving 
            my skills to become a better developer.
          </p>

          <!-- Info Cards -->
          <div class="grid sm:grid-cols-2 gap-4 mb-8">
            <div 
              v-for="info in personalInfo" 
              :key="info.label"
              class="p-4 rounded-xl transition-all duration-300 card-hover"
              :class="isDark ? 'bg-gray-700/50' : 'bg-gray-50'"
            >
              <div class="flex items-center gap-3">
                <div 
                  class="w-10 h-10 rounded-lg flex items-center justify-center"
                  :class="isDark ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-100 text-primary-600'"
                >
                  <component :is="info.icon" class="w-5 h-5" />
                </div>
                <div>
                  <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">{{ info.label }}</p>
                  <p class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ info.value }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Download CV Button -->
          <a 
            href="#" 
            class="btn-primary px-8 py-4 rounded-full text-white font-semibold inline-flex items-center gap-2 group"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Download CV
            <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
          </a>
        </div>
      </div>
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

// Icons
const UserIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })
])

const LocationIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' }),
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 11a3 3 0 11-6 0 3 3 0 016 0z' })
])

const MailIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' })
])

const BriefcaseIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' })
])

const personalInfo = [
  { label: 'Name', value: 'Muhammad Ali Ghozi', icon: UserIcon },
  { label: 'Location', value: 'Indonesia', icon: LocationIcon },
  { label: 'Email', value: 'zenscilla@gmail.com' , icon: MailIcon },
  { label: 'Status', value: 'Available for work', icon: BriefcaseIcon }
]
</script>