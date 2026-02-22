<template>
  <section 
    id="education" 
    class="py-20 lg:py-32 relative overflow-hidden"
    :class="isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-blue-50'"
  >
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <span 
          class="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 animate-fade-in-up"
          :class="isDark ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-100 text-primary-700'"
        >
          My Journey
        </span>
        <h2 
          class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in-up delay-100"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          Education <span class="gradient-text">History</span>
        </h2>
        <div class="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full"></div>
      </div>

      <!-- Timeline -->
      <div class="relative">
        <!-- Timeline Line (Desktop) -->
        <div 
          class="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 rounded-full"
          :class="isDark ? 'bg-gray-700' : 'bg-gray-200'"
        >
          <div class="absolute inset-0 bg-gradient-to-b from-primary-500 via-accent-500 to-primary-500 rounded-full animate-pulse"></div>
        </div>

        <!-- Timeline Items -->
        <div class="space-y-8 lg:space-y-12">
          <div 
            v-for="(edu, index) in educationData" 
            :key="edu.id"
            class="relative"
          >
            <!-- Mobile Layout -->
            <div class="lg:hidden">
              <div 
                class="p-6 rounded-2xl card-hover transition-all duration-300"
                :class="isDark ? 'bg-gray-800' : 'bg-white shadow-lg'"
              >
                <div class="flex items-start gap-4">
                  <div 
                    class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    :class="isDark ? 'bg-primary-500/20' : 'bg-primary-100'"
                  >
                    <svg class="w-7 h-7" :class="isDark ? 'text-primary-400' : 'text-primary-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <span 
                      class="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2"
                      :class="isDark ? 'bg-accent-500/20 text-accent-400' : 'bg-accent-100 text-accent-700'"
                    >
                      {{ edu.year }}
                    </span>
                    <h3 
                      class="text-lg font-bold mb-1"
                      :class="isDark ? 'text-white' : 'text-gray-900'"
                    >
                      {{ edu.institution }}
                    </h3>
                    <p 
                      class="font-medium mb-2"
                      :class="isDark ? 'text-primary-400' : 'text-primary-600'"
                    >
                      {{ edu.degree }}
                    </p>
                    <p 
                      class="text-sm"
                      :class="isDark ? 'text-gray-400' : 'text-gray-600'"
                    >
                      {{ edu.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Desktop Layout -->
            <div 
              class="hidden lg:flex items-center"
              :class="index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'"
            >
              <!-- Content Card -->
              <div 
                class="w-5/12 p-6 rounded-2xl card-hover transition-all duration-300"
                :class="[
                  isDark ? 'bg-gray-800' : 'bg-white shadow-lg',
                  index % 2 === 0 ? 'text-right' : 'text-left'
                ]"
              >
                <span 
                  class="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
                  :class="isDark ? 'bg-accent-500/20 text-accent-400' : 'bg-accent-100 text-accent-700'"
                >
                  {{ edu.year }}
                </span>
                <h3 
                  class="text-xl font-bold mb-2"
                  :class="isDark ? 'text-white' : 'text-gray-900'"
                >
                  {{ edu.institution }}
                </h3>
                <p 
                  class="font-medium mb-2"
                  :class="isDark ? 'text-primary-400' : 'text-primary-600'"
                >
                  {{ edu.degree }}
                </p>
                <p 
                  class="text-sm"
                  :class="isDark ? 'text-gray-400' : 'text-gray-600'"
                >
                  {{ edu.description }}
                </p>
              </div>

              <!-- Timeline Dot -->
              <div class="w-2/12 flex justify-center">
                <div 
                  class="w-5 h-5 rounded-full border-4 z-10 transition-transform duration-300 hover:scale-125"
                  :class="isDark 
                    ? 'bg-primary-500 border-primary-300' 
                    : 'bg-primary-600 border-primary-200'"
                ></div>
              </div>

              <!-- Empty Space -->
              <div class="w-5/12"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, inject, type Ref } from 'vue'

const isDark = inject<Ref<boolean>>('isDark', ref(false))

interface Education {
  id: number
  year: string
  institution: string
  degree: string
  description: string
}

const educationData: Education[] = [
  {
    id: 1,
    year: '2021 - 2025',
    institution: 'UNIVERSITAS IBN KHALDUN BOGOR',
    degree: 'Bachelor of Computer Science',
    description: 'Focused on software engineering and web development. Graduated with honors. Active member of the programming community.'
  },
  // {
  //   id: 2,
  //   year: '2017 - 2020',
  //   institution: 'Senior High School',
  //   degree: 'Science Major',
  //   description: 'Specialized in mathematics and computer science. Participated in various programming competitions.'
  // },
  // {
  //   id: 3,
  //   year: '2014 - 2017',
  //   institution: 'Junior High School',
  //   degree: 'General Education',
  //   description: 'Started learning basic programming and discovered passion for technology.'
  // }
]
</script>