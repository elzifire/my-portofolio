<template>
  <section 
    id="projects" 
    class="py-20 lg:py-32 relative overflow-hidden"
    :class="isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-blue-50'"
  >
    <!-- Background Decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <svg class="absolute top-0 left-0 w-full h-full opacity-[0.03]" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.5"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" :class="isDark ? 'text-white' : 'text-gray-900'"/>
      </svg>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <span
          class="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 animate-fade-in-up"
          :class="isDark ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-100 text-primary-700'"
        >
          My Work
        </span>
        <h2 
          class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in-up delay-100"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          Featured <span class="gradient-text">Projects</span>
        </h2>
        <div class="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full"></div>
      </div>

      <!-- Filter Tabs -->
      <div class="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in-up delay-200">
        <button
          v-for="filter in filters"
          :key="filter"
          @click="activeFilter = filter"
          class="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 capitalize"
          :class="activeFilter === filter
            ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/25'
            : isDark
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'"
        >
          {{ filter }}
        </button>
      </div>

      <!-- Projects Grid -->
      <TransitionGroup
        tag="div"
        class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-for="(project, index) in filteredProjects"
          :key="project.id"
          class="group"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <div 
            class="rounded-2xl overflow-hidden card-hover transition-all duration-300 h-full flex flex-col"
            :class="isDark ? 'bg-gray-800' : 'bg-white shadow-lg'"
          >
            <!-- Project Image/Preview -->
            <div class="relative overflow-hidden h-48 lg:h-56">
              <div 
                class="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                :style="{ background: project.gradient }"
              >
                <!-- Project Icon -->
                <div class="text-center text-white">
                  <div class="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span v-html="project.icon" class="w-8 h-8"></span>
                  </div>
                  <span class="text-sm font-medium opacity-80">{{ project.type }}</span>
                </div>
              </div>

              <!-- Overlay on Hover -->
              <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                <a 
                  v-if="project.liveUrl"
                  :href="project.liveUrl" 
                  target="_blank"
                  class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                  title="Live Demo"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </a>
                <a 
                  v-if="project.githubUrl"
                  :href="project.githubUrl" 
                  target="_blank"
                  class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                  style="transition-delay: 100ms;"
                  title="GitHub"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>

              <!-- Status Badge -->
              <div class="absolute top-4 right-4">
                <span 
                  class="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
                  :class="project.status === 'completed' 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'"
                >
                  {{ project.status === 'completed' ? '✓ Completed' : '⚡ In Progress' }}
                </span>
              </div>
            </div>

            <!-- Project Info -->
            <div class="p-6 flex flex-col flex-1">
              <h3 
                class="text-xl font-bold mb-2 group-hover:text-primary-500 transition-colors duration-300"
                :class="isDark ? 'text-white' : 'text-gray-900'"
              >
                {{ project.title }}
              </h3>

              <p 
                class="text-sm mb-4 flex-1"
                :class="isDark ? 'text-gray-400' : 'text-gray-600'"
              >
                {{ project.description }}
              </p>

              <!-- Tech Stack Tags -->
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tech in project.techStack"
                  :key="tech"
                  class="px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300"
                  :class="isDark 
                    ? 'bg-gray-700 text-gray-300 hover:bg-primary-500/20 hover:text-primary-400'
                    : 'bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-700'"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- Call to Action -->
      <div class="text-center mt-12 animate-fade-in-up">
        <a 
          href="https://github.com/elzifire" 
          target="_blank"
          class="btn-primary px-8 py-4 rounded-full text-white font-semibold inline-flex items-center gap-3 group"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          See More on GitHub
          <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, inject, computed, type Ref } from 'vue'

const isDark = inject<Ref<boolean>>('isDark', ref(false))
const activeFilter = ref('all')

interface Project {
  id: number
  title: string
  description: string
  techStack: string[]
  category: string
  gradient: string
  icon: string
  liveUrl?: string
  githubUrl?: string
  status: 'completed' | 'in-progress'
  type: string
}

const filters = ['all', 'web', 'Fullstack', 'Frontend']

const projects: Project[] = [
  {
    id: 1,
    title: 'MASJID IBN KHALDUN BOGOR',
    description: 'A comprehensive mosque management system with event scheduling, donation tracking, and community engagement features.',
    techStack: ['Laravel', 'Vue.js', 'MySQL', 'Bootstrap'],
    category: 'Fullstack',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: '<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--twemoji" preserveAspectRatio="xMidYMid meet" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#F4900C" d="M23 4.326c0 4.368-9.837 6.652-9.837 13.206c0 2.184 1.085 4.468 2.177 4.468h15.291c1.093 0 2.192-2.284 2.192-4.468C32.823 10.977 23 8.694 23 4.326z"></path><path fill="#FFD983" d="M35 33.815C35 35.022 34.711 36 32.815 36h-19.66C11.26 36 11 35.022 11 33.815V22.894c0-1.206.26-1.894 2.156-1.894h19.66c1.895 0 2.184.688 2.184 1.894v10.921z"></path><path fill="#FFD983" d="M23 34a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v1z"></path><path fill="#662113" d="M26 29c0-3-1.896-5-3-5s-3 2-3 5v7h6v-7zm-8 2.333c0-2-1.264-3.333-2-3.333s-2 1.333-2 3.333V36h4v-4.667zm14 0c0-2-1.264-3.333-2-3.333s-2 1.333-2 3.333V36h4v-4.667z"></path><path fill="#FFD983" d="M9 34a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v26z"></path><path fill="#F4900C" d="M5.995.326c0 1.837-2.832 2.918-2.832 5.675c0 .919.312 2 .627 2h4.402c.314 0 .631-1.081.631-2c0-2.757-2.828-3.838-2.828-5.675z"></path><path fill="#FFAC33" d="M10 12a1 1 0 0 1-1 1H3a1 1 0 0 1 0-2h6a1 1 0 0 1 1 1zm0-4a1 1 0 0 1-1 1H3a1 1 0 0 1 0-2h6a1 1 0 0 1 1 1z"></path></g></svg>',
    liveUrl: 'https://masjid.uika-bogor.ac.id',
    status: 'completed',
    type: 'Full Stack'
  },
  {
    id: 2,
    title: 'Portfolio Website',
    description: 'Modern portfolio website with dark mode, smooth animations, responsive design built with Nuxt.js and Tailwind CSS.',
    techStack: ['Nuxt.js', 'Vue.js', 'Tailwind CSS'],
    category: 'web',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: '<svg fill="none" stroke="white" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    liveUrl: '#',
    githubUrl: 'https://github.com',
    status: 'completed',
    type: 'Frontend'
  },
  {
    id: 3,
    title: 'Akses Kelola Perhutanan Sosial',
    description: 'A web-based application for managing social forestry access, including tracking news, permit applications, and real-time monitoring.',
    techStack: ['PHP', 'PostgreSQL', 'Bootstrap', 'jQuery', 'Docker'],
    category: 'Fullstack',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    icon: '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#000000" d="M169.92 15.654c-10.512 16.697-22.392 34.058-41.688 50.473.46.447.934.89 1.405 1.336l23.55-.406-3.527 10.7c-.505 1.53-1.065 3.048-1.678 4.552 2.803 1.945 5.745 3.875 8.872 5.788l25.052 15.33-45.99-.793c-1.954 2.474-4.06 4.9-6.305 7.275 8.8 11.517 22.045 22.713 38.675 32.766l-12.404-.365-.015 5.678c8.53 6.358 17.792 12.448 27.162 18.48 18.11-11.568 31.79-24.5 39.51-37.616l-57.353.99 25.052-15.33c8.97-5.488 16.525-11.115 23.082-16.867-5.098-5.475-9-10.962-11.257-16.69l-4.04-10.246 29.742-1.823C205.14 54.41 182.44 38.31 169.92 15.654zm234.605 13.223c-6.537 12.962-13.88 29.016-23.638 44.63 10.927 18.367 24.428 35.997 46.773 52.382l20.42 14.97-52.51-1.085c6.956 12.136 19.936 26.858 34.58 40.047 19.157 17.254 40.928 32.572 53.907 39.914l11.34 6.418c.005-4.163.005-7.382.015-13.972-17.176-11.938-29.767-25.795-36.322-42.2l-4.115-10.298 43.605-2.58c-9.91-4.358-19.747-8.263-28.723-12.06-8.498-3.594-16.23-7.107-22.724-11.23-6.495-4.122-12.102-8.954-14.858-15.943l-3.93-9.962 36.077-3.178c-24.245-20.226-47.223-48.756-59.897-75.853zM84.027 34.62c-12.52 22.656-35.22 38.757-57.843 53.234l29.738 1.822-4.037 10.244c-4.78 12.125-16.815 24.123-33.182 36.873-.295 11.21-.392 17.66-.385 17.732.005.044.19 1.1.29 3.127.038.742.04 3.177.066 4.358l13.828.797-.004.55-3.906 9.778c-1.18 2.955-2.498 6.07-4.16 9.232l11.525-7.05c37.376-22.87 50.42-48.163 67.395-74.833l-.233 6.366 4.474-1.875c-1.277-2.702-2.382-5.452-3.305-8.25l-3.528-10.7 26.582.46C107.068 69.66 94.836 51.787 84.027 34.618zM263.06 61.036c-10.808 17.168-23.04 35.04-43.314 51.86l26.582-.458-3.527 10.7c-6.657 20.188-22.772 37.89-44.874 52.91l17.916 11.573 18.273.688-4.127 10.5c-2.305 5.863-5.355 11.4-9.01 16.65l8.737-6.19c17.913-12.69 36.773-27.495 51.8-41.534 10.026-9.365 17.978-18.52 23.083-25.914l-50.537-3.715 16.5-12.773c10.37-8.027 20.973-15.94 30.924-24.178-15.49-11.246-29.53-24.024-38.423-40.12zm93.07.68c-12.76 26.805-36.227 46.04-59.107 63.506l31.39 2.306-3.194 9.726c-4.503 13.7-16.983 27.412-32.783 42.172-10.794 10.083-23.245 20.29-35.896 29.926l49.278 3.494-3.26 9.78c-11.273 33.806-46.845 56.924-75.816 75.597 13.487 8.056 27.67 15.44 39.813 22.318 68.34 18.82 147.594 6.972 200.924-16-13.19-7.554-23.844-14.547-32.748-23.006-11.805-11.216-20.072-24.96-26.377-44.183l-3.017-9.208 51.97-6.61c-11.874-8.21-25.17-18.39-37.867-29.825-20.11-18.113-38.394-38.003-43.915-58.067L372.68 123.3l27.867.577c-21.174-20.07-33.542-41.485-44.416-62.16zM108.78 121.84c-10.807 17.168-23.038 35.04-43.313 51.86l26.582-.456-3.53 10.697c-8.24 24.998-30.974 46.186-61.625 63.185l52.94 1.99-4.126 10.496c-11.05 28.11-29.76 52.974-61.038 71.585 73.885 22.566 156.574 31.568 231.582-3.572-12.908-7.055-26.9-14.653-40.33-23.56-18.07-11.983-34.525-25.736-41.71-43.713l-4.116-10.3 48.4-2.864c-11.828-7.625-23.415-15.48-33.557-23.383-16.245-12.663-29.06-24.086-34.02-36.664l-4.04-10.247 29.74-1.823c-22.62-14.476-45.318-30.576-57.84-53.23zM68.26 189.656l-49.016.844c-.168.218-.32.44-.492.656-.276 21.495-.448 33.384-.502 42.38 23.342-13.057 40.863-28.338 50.01-43.88zm105.674 12.403c3.27 2.968 6.883 6.035 10.845 9.124 3.52 2.743 7.266 5.524 11.14 8.308 5.44-5.177 10.084-10.545 13.692-16.092l-35.678-1.34zm41.658 20.428c-1.87 2.225-3.865 4.388-5.947 6.504 9.277 6.192 18.952 12.242 28.38 17.815l17.645 10.427c11.34-9.42 21.135-19.423 27.215-29.972l-67.293-4.774zm279.803 10.334l-68.383 8.698c4.666 11.45 10.047 19.75 17.28 26.992l-.21-9.6c17.455-.996 34.705-3.352 51.4-7.363-.065-7.174-.084-12.42-.087-18.728zm-243.96 27.852l-66.394 3.928c3.903 5.187 9.085 10.326 15.097 15.314 6.417 1.284 12.905 2.463 19.455 3.504 10.638-7.12 21.72-14.713 31.842-22.746zm-219.744 2.64l-.29 35.618c10.746-10.37 18.692-21.97 24.83-34.694l-24.54-.924zm413.947 66.534c-14.262 4.577-29.517 8.396-45.38 11.222l5.55 132.18h42.978l-3.148-143.402zm-181.83 7.002c-2.663 1.404-5.337 2.75-8.018 4.046l-.927 114.274h52.682l-2.426-110.496c-13.946-1.552-27.788-4.123-41.313-7.824zm120.54 6.693c-15.085 1.992-30.582 3.05-46.18 2.994l-.386 139.742h52.56l-5.994-142.737zm-353.38 9.146l-.924 114.04H74.31l1.975-104.398c-15.362-2.464-30.51-5.75-45.318-9.643zm174.72 6.27c-11.576 2.87-23.226 4.935-34.898 6.284l3.915 66.195h33.065l-2.084-72.48zm-113.443 5.628l-2.508 132.56 72.692-2.287-7.584-128.21c-20.97 1.29-41.936.424-62.6-2.062z"></path></g></svg>',
    liveUrl: 'https://pkps.hutsos.kehutanan.go.id/akps/general/searching-mail',
    status: 'completed',
    type: 'Full Stack'
  },
  {
    id: 4,
    title: 'Complain Management System',
    description: 'A web application for managing customer complaints with ticketing system, status tracking, and admin dashboard for analytics.',
    techStack: ['Node JS', 'PHP', 'PostgreSQL', 'Bootstrap', 'Nuxt.js'],
    category: 'Fullstack',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    icon: '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#000000" d="M169.92 15.654c-10.512 16.697-22.392 34.058-41.688 50.473.46.447.934.89 1.405 1.336l23.55-.406-3.527 10.7c-.505 1.53-1.065 3.048-1.678 4.552 2.803 1.945 5.745 3.875 8.872 5.788l25.052 15.33-45.99-.793c-1.954 2.474-4.06 4.9-6.305 7.275 8.8 11.517 22.045 22.713 38.675 32.766l-12.404-.365-.015 5.678c8.53 6.358 17.792 12.448 27.162 18.48 18.11-11.568 31.79-24.5 39.51-37.616l-57.353.99 25.052-15.33c8.97-5.488 16.525-11.115 23.082-16.867-5.098-5.475-9-10.962-11.257-16.69l-4.04-10.246 29.742-1.823C205.14 54.41 182.44 38.31 169.92 15.654zm234.605 13.223c-6.537 12.962-13.88 29.016-23.638 44.63 10.927 18.367 24.428 35.997 46.773 52.382l20.42 14.97-52.51-1.085c6.956 12.136 19.936 26.858 34.58 40.047 19.157 17.254 40.928 32.572 53.907 39.914l11.34 6.418c.005-4.163.005-7.382.015-13.972-17.176-11.938-29.767-25.795-36.322-42.2l-4.115-10.298 43.605-2.58c-9.91-4.358-19.747-8.263-28.723-12.06-8.498-3.594-16.23-7.107-22.724-11.23-6.495-4.122-12.102-8.954-14.858-15.943l-3.93-9.962 36.077-3.178c-24.245-20.226-47.223-48.756-59.897-75.853zM84.027 34.62c-12.52 22.656-35.22 38.757-57.843 53.234l29.738 1.822-4.037 10.244c-4.78 12.125-16.815 24.123-33.182 36.873-.295 11.21-.392 17.66-.385 17.732.005.044.19 1.1.29 3.127.038.742.04 3.177.066 4.358l13.828.797-.004.55-3.906 9.778c-1.18 2.955-2.498 6.07-4.16 9.232l11.525-7.05c37.376-22.87 50.42-48.163 67.395-74.833l-.233 6.366 4.474-1.875c-1.277-2.702-2.382-5.452-3.305-8.25l-3.528-10.7 26.582.46C107.068 69.66 94.836 51.787 84.027 34.618zM263.06 61.036c-10.808 17.168-23.04 35.04-43.314 51.86l26.582-.458-3.527 10.7c-6.657 20.188-22.772 37.89-44.874 52.91l17.916 11.573 18.273.688-4.127 10.5c-2.305 5.863-5.355 11.4-9.01 16.65l8.737-6.19c17.913-12.69 36.773-27.495 51.8-41.534 10.026-9.365 17.978-18.52 23.083-25.914l-50.537-3.715 16.5-12.773c10.37-8.027 20.973-15.94 30.924-24.178-15.49-11.246-29.53-24.024-38.423-40.12zm93.07.68c-12.76 26.805-36.227 46.04-59.107 63.506l31.39 2.306-3.194 9.726c-4.503 13.7-16.983 27.412-32.783 42.172-10.794 10.083-23.245 20.29-35.896 29.926l49.278 3.494-3.26 9.78c-11.273 33.806-46.845 56.924-75.816 75.597 13.487 8.056 27.67 15.44 39.813 22.318 68.34 18.82 147.594 6.972 200.924-16-13.19-7.554-23.844-14.547-32.748-23.006-11.805-11.216-20.072-24.96-26.377-44.183l-3.017-9.208 51.97-6.61c-11.874-8.21-25.17-18.39-37.867-29.825-20.11-18.113-38.394-38.003-43.915-58.067L372.68 123.3l27.867.577c-21.174-20.07-33.542-41.485-44.416-62.16zM108.78 121.84c-10.807 17.168-23.038 35.04-43.313 51.86l26.582-.456-3.53 10.697c-8.24 24.998-30.974 46.186-61.625 63.185l52.94 1.99-4.126 10.496c-11.05 28.11-29.76 52.974-61.038 71.585 73.885 22.566 156.574 31.568 231.582-3.572-12.908-7.055-26.9-14.653-40.33-23.56-18.07-11.983-34.525-25.736-41.71-43.713l-4.116-10.3 48.4-2.864c-11.828-7.625-23.415-15.48-33.557-23.383-16.245-12.663-29.06-24.086-34.02-36.664l-4.04-10.247 29.74-1.823c-22.62-14.476-45.318-30.576-57.84-53.23zM68.26 189.656l-49.016.844c-.168.218-.32.44-.492.656-.276 21.495-.448 33.384-.502 42.38 23.342-13.057 40.863-28.338 50.01-43.88zm105.674 12.403c3.27 2.968 6.883 6.035 10.845 9.124 3.52 2.743 7.266 5.524 11.14 8.308 5.44-5.177 10.084-10.545 13.692-16.092l-35.678-1.34zm41.658 20.428c-1.87 2.225-3.865 4.388-5.947 6.504 9.277 6.192 18.952 12.242 28.38 17.815l17.645 10.427c11.34-9.42 21.135-19.423 27.215-29.972l-67.293-4.774zm279.803 10.334l-68.383 8.698c4.666 11.45 10.047 19.75 17.28 26.992l-.21-9.6c17.455-.996 34.705-3.352 51.4-7.363-.065-7.174-.084-12.42-.087-18.728zm-243.96 27.852l-66.394 3.928c3.903 5.187 9.085 10.326 15.097 15.314 6.417 1.284 12.905 2.463 19.455 3.504 10.638-7.12 21.72-14.713 31.842-22.746zm-219.744 2.64l-.29 35.618c10.746-10.37 18.692-21.97 24.83-34.694l-24.54-.924zm413.947 66.534c-14.262 4.577-29.517 8.396-45.38 11.222l5.55 132.18h42.978l-3.148-143.402zm-181.83 7.002c-2.663 1.404-5.337 2.75-8.018 4.046l-.927 114.274h52.682l-2.426-110.496c-13.946-1.552-27.788-4.123-41.313-7.824zm120.54 6.693c-15.085 1.992-30.582 3.05-46.18 2.994l-.386 139.742h52.56l-5.994-142.737zm-353.38 9.146l-.924 114.04H74.31l1.975-104.398c-15.362-2.464-30.51-5.75-45.318-9.643zm174.72 6.27c-11.576 2.87-23.226 4.935-34.898 6.284l3.915 66.195h33.065l-2.084-72.48zm-113.443 5.628l-2.508 132.56 72.692-2.287-7.584-128.21c-20.97 1.29-41.936.424-62.6-2.062z"></path></g></svg>',
    liveUrl: 'https://pkps.hutsos.kehutanan.go.id/pengaduan',
    status: 'completed',
    type: 'Full Stack'
  },
  {
    id: 5,
    title: 'Landing Page Company',
    description: 'Responsive company landing page with modern design, smooth scroll animations, and contact form integration.',
    techStack: ['HTML', 'CSS', 'JavaScript', 'Tailwind CSS'],
    category: 'Frontend',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    icon: '<svg fill="none" stroke="white" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.5h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"/></svg>',
    liveUrl: 'https://pkps.hutsos.kehutanan.go.id',
    // githubUrl: 'https://github.com',
    status: 'completed',
    type: 'Frontend'
  },
  {
    id: 6,
    title: 'Setoran Hafalan Al-Qur\'an',
    description: 'A web application for managing Quran memorization records, allowing users to track progress, set goals, and receive feedback from teachers.',
    techStack: ['Laravel', 'Nuxt.js', 'MySQL', 'Bootstrap'],
    category: 'Fullstack',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: '<svg fill="none" stroke="white" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.5h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"/></svg>',
    liveUrl: 'https://ppiq.vercel.app',
    status: 'completed',
    type: 'Full Stack'
  },
]

const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') return projects
  return projects.filter(p => p.category === activeFilter.value)
})
</script>
