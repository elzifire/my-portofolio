<template>
  <section 
    id="contact" 
    class="py-20 lg:py-32 relative overflow-hidden"
    :class="isDark ? 'bg-gray-800' : 'bg-white'"
  >
    <!-- Animated Background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl animate-float"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl animate-float" style="animation-delay: 2s;"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <span
          class="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 animate-fade-in-up"
          :class="isDark ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-100 text-primary-700'"
        >
          Let's connect
        </span>
        <h2 
          class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in-up delay-100"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          Get In <span class="gradient-text">Touch</span>
        </h2>
        <div class="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full"></div>
        <p 
          class="mt-6 text-lg max-w-2xl mx-auto animate-fade-in-up delay-200"
          :class="isDark ? 'text-gray-400' : 'text-gray-600'"
        >
          Feel free to reach out to me for any opportunities, collaboration, or just to say hello!
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-12 lg:gap-16">
        <!-- Contact Info -->
        <div class="space-y-8 animate-fade-in-left">
          <!-- Info Cards -->
          <div 
            v-for="(info, index) in contactInfo" 
            :key="info.title"
            class="flex items-start gap-5 p-6 rounded-2xl card-hover transition-all duration-300"
            :class="isDark ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-white hover:shadow-lg'"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div 
              class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              :style="{ background: `linear-gradient(135deg, ${info.color}20, ${info.color}10)` }"
            >
              <span v-html="info.icon" class="w-6 h-6" :style="{ color: info.color }"></span>
            </div>
            <div>
              <h3 
                class="font-bold text-lg mb-1"
                :class="isDark ? 'text-white' : 'text-gray-900'"
              >
                {{ info.title }}
              </h3>
              <p 
                class="text-sm mb-2"
                :class="isDark ? 'text-gray-400' : 'text-gray-500'"
              >
                {{ info.subtitle }}
              </p>
              <a 
                :href="info.link" 
                class="font-medium transition-colors duration-300 hover:text-primary-500"
                :class="isDark ? 'text-primary-400' : 'text-primary-600'"
              >
                {{ info.value }}
              </a>
            </div>
          </div>

          <!-- Social Links -->
          <div class="pt-4">
            <h3 
              class="font-bold text-lg mb-4"
              :class="isDark ? 'text-white' : 'text-gray-900'"
            >
              Follow me on social media
            </h3>
            <div class="flex gap-3">
              <a 
                v-for="social in socials" 
                :key="social.name"
                :href="social.url" 
                target="_blank"
                class="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group"
                :class="isDark 
                  ? 'bg-gray-700 text-gray-400 hover:text-white'
                  : 'bg-gray-100 text-gray-600 hover:text-white'"
                :style="{ '--hover-bg': social.color }"
                @mouseenter="handleSocialHover($event, social.color)"
                @mouseleave="handleSocialLeave($event)"
                :title="social.name"
              >
                <span v-html="social.icon" class="w-5 h-5"></span>
              </a>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="animate-fade-in-right">
          <form 
            @submit.prevent="handleSubmit" 
            class="p-8 rounded-2xl space-y-6"
            :class="isDark ? 'bg-gray-700/50' : 'bg-gray-50'"
          >
            <div class="grid sm:grid-cols-2 gap-6">
              <div>
                <label 
                  for="name" 
                  class="block text-sm font-semibold mb-2"
                  :class="isDark ? 'text-gray-300' : 'text-gray-700'"
                >
                  Name
                </label>
                <input 
                  id="name"
                  v-model="form.name"
                  type="text" 
                  placeholder="Your name"
                  class="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0"
                  :class="isDark 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-primary-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary-500'"
                />
              </div>
              <div>
                <label 
                  for="email" 
                  class="block text-sm font-semibold mb-2"
                  :class="isDark ? 'text-gray-300' : 'text-gray-700'"
                >
                  Email
                </label>
                <input 
                  id="email"
                  v-model="form.email"
                  type="email" 
                  placeholder="your@email.com"
                  class="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0"
                  :class="isDark 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-primary-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary-500'"
                />
              </div>
            </div>

            <div>
              <label 
                for="subject" 
                class="block text-sm font-semibold mb-2"
                :class="isDark ? 'text-gray-300' : 'text-gray-700'"
              >
                Subject
              </label>
              <input 
                id="subject"
                v-model="form.subject"
                type="text" 
                placeholder="What's this about?"
                class="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0"
                :class="isDark 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-primary-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary-500'"
              />
            </div>

            <div>
              <label 
                for="message" 
                class="block text-sm font-semibold mb-2"
                :class="isDark ? 'text-gray-300' : 'text-gray-700'"
              >
                Message
              </label>
              <textarea 
                id="message"
                v-model="form.message"
                rows="5" 
                placeholder="Write your message here..."
                class="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 resize-none"
                :class="isDark 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-primary-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary-500'"
              ></textarea>
            </div>

            <button 
              type="submit" 
              class="w-full btn-primary py-4 rounded-xl text-white font-semibold inline-flex items-center justify-center gap-3 group"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Send Message
              <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, inject, reactive, type Ref } from 'vue'

const isDark = inject<Ref<boolean>>('isDark', ref(false))

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const handleSubmit = () => {
  const mailtoLink = `mailto:zenscilla@gmail.com?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`
  window.open(mailtoLink)
}

const handleSocialHover = (event: Event, color: string) => {
  const el = event.currentTarget as HTMLElement
  el.style.backgroundColor = color
}

const handleSocialLeave = (event: Event) => {
  const el = event.currentTarget as HTMLElement
  el.style.backgroundColor = ''
}

const contactInfo = [
  {
    title: 'Email',
    subtitle: 'Send me a message anytime',
    value: 'zenscilla@gmail.com',
    link: 'mailto:zenscilla@gmail.com',
    color: '#3b82f6',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>'
  },
  {
    title: 'Location',
    subtitle: 'Based in',
    value: 'Indonesia',
    link: '#',
    color: '#8b5cf6',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>'
  },
  {
    title: 'Availability',
    subtitle: 'Current status',
    value: 'Open for opportunities',
    link: '#',
    color: '#10b981',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
  }
]

const socials = [
  {
    name: 'GitHub',
    url: 'https://github.com/elzifire',
    color: '#333',
    icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>'
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/ghozi-muhammad-ali-b7943225b/',
    color: '#0A66C2',
    icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>'
  },
//   {
//     name: 'Twitter',
//     url: 'https://twitter.com',
//     color: '#1DA1F2',
//     icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>'
//   },
  {
    name: 'Instagram',
    url: 'https://instagram.com/elzifire_dg',
    color: '#E4405F',
    icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>'
  }
]
</script>
