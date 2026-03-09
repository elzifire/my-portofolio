<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="[
      isScrolled ? 'glass shadow-lg' : 'bg-transparent',
      isDark ? 'text-white' : 'text-gray-800'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 md:h-20">
        <!-- Logo -->
        <NuxtLink
          to="#"
          class="text-xl md:text-2xl font-bold gradient-text flex items-center gap-2"
        >
          <HomeIcon class="w-8 h-8" />
          <span>Portfolio</span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <div
            v-for="item in navItems"
            :key="item.id"
            class="relative group"
          >
            <!-- Normal Link -->
            <a
              v-if="!item.children"
              :href="item.href"
              class="nav-link flex items-center gap-2 font-medium transition-colors duration-300"
              :class="isDark ? 'hover:text-primary-400' : 'hover:text-primary-600'"
            >
              <component :is="item.icon" class="w-5 h-5" />
              {{ item.label }}
            </a>

            <!-- Dropdown Trigger -->
            <button
              v-else
              class="flex items-center gap-2 font-medium transition-colors duration-300"
              :class="isDark ? 'hover:text-primary-400' : 'hover:text-primary-600'"
            >
              <component :is="item.icon" class="w-5 h-5" />
              {{ item.label }}
              <ChevronDownIcon class="w-4 h-4 mt-0.5" />
            </button>

            <!-- Dropdown Menu -->
            <div
              class="absolute top-full left-0 mt-3 w-44 rounded-xl shadow-lg opacity-0 invisible
                     group-hover:opacity-100 group-hover:visible transition-all duration-300 glass"
            >
              <a
                v-for="child in item.children"
                :key="child.href"
                :href="child.href"
                class="flex items-center gap-2 px-4 py-3 text-sm rounded-lg transition
                       hover:bg-black/10 dark:hover:bg-white/10"
              >
                <component :is="child.icon" class="w-4 h-4" />
                {{ child.label }}
              </a>
            </div>
          </div>

          <!-- Language Switcher -->
          <LanguageSwitcher />

          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDarkMode"
            class="p-2 rounded-full transition-all duration-300"
            :class="isDark ? 'bg-gray-800' : 'bg-gray-100'"
          >
            <SunIcon v-if="isDark" class="w-5 h-5 text-yellow-400" />
            <MoonIcon v-else class="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <!-- Mobile Buttons -->
        <div class="md:hidden flex items-center gap-3">
          <LanguageSwitcher />
          <button
            @click="toggleDarkMode"
            class="p-2 rounded-full"
            :class="isDark ? 'bg-gray-800' : 'bg-gray-100'"
          >
            <SunIcon v-if="isDark" class="w-5 h-5 text-yellow-400" />
            <MoonIcon v-else class="w-5 h-5 text-gray-600" />
          </button>

          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="p-2 rounded-lg"
          >
            <Bars3Icon class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden glass border-t"
        :class="isDark ? 'border-gray-700' : 'border-gray-200'"
      >
        <div class="px-4 py-4 space-y-2">
          <div v-for="item in navItems" :key="item.id">
            <!-- Normal -->
            <a
              v-if="!item.children"
              :href="item.href"
              @click="isMobileMenuOpen = false"
              class="flex items-center gap-2 px-4 py-3 rounded-lg font-medium"
            >
              <component :is="item.icon" class="w-5 h-5" />
              {{ item.label }}
            </a>

            <!-- Dropdown -->
            <div v-else>
              <button
                @click="openMobileDropdown = openMobileDropdown === item.id ? null : item.id"
                class="w-full flex justify-between items-center px-4 py-3 rounded-lg font-medium"
              >
                <span class="flex items-center gap-2">
                  <component :is="item.icon" class="w-5 h-5" />
                  {{ item.label }}
                </span>
                <ChevronDownIcon class="w-4 h-4" />
              </button>

              <div
                v-if="openMobileDropdown === item.id"
                class="pl-6 mt-1 space-y-1"
              >
                <a
                  v-for="child in item.children"
                  :key="child.href"
                  :href="child.href"
                  @click="isMobileMenuOpen = false"
                  class="flex items-center gap-2 px-4 py-2 text-sm rounded-lg"
                >
                  <component :is="child.icon" class="w-4 h-4" />
                  {{ child.label }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject, type Ref } from 'vue'
import {
  HomeIcon,
  UserIcon,
  PuzzlePieceIcon,
  CodeBracketIcon,
  FolderIcon,
  EnvelopeIcon,
  ChevronDownIcon,
  MoonIcon,
  SunIcon,
  Bars3Icon,
} from '@heroicons/vue/24/outline'

interface NavItem {
  id: number
  label: string
  href?: string
  icon?: any
  children?: {
    label: string
    href: string
    icon?: any
  }[]
}

const { t } = useI18n()

const navItems = computed<NavItem[]>(() => [
  { id: 1, label: t('nav.home'), href: '#home', icon: HomeIcon },
  { id: 2, label: t('nav.about'), href: '#about', icon: UserIcon },
  {
    id: 3,
    label: t('nav.games'),
    icon: PuzzlePieceIcon,
    children: [
      { label: t('nav.chess'), href: '/chess/', icon: PuzzlePieceIcon },
      { label: t('nav.snake'), href: '/snake/', icon: PuzzlePieceIcon },
    ]
  },
  { id: 4, label: t('nav.skills'), href: '#skills', icon: CodeBracketIcon },
  { id: 5, label: t('nav.projects'), href: '#projects', icon: FolderIcon },
  { id: 6, label: t('nav.contact'), href: '#contact', icon: EnvelopeIcon }
])

const isDark = inject<Ref<boolean>>('isDark', ref(false))
const toggleDarkMode = inject<() => void>('toggleDarkMode', () => {})
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const openMobileDropdown = ref<number | null>(null)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transition: width 0.3s ease;
}
.nav-link:hover::after {
  width: 100%;
}
</style>