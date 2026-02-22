<template>
  <div :class="{ dark: isDark }">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'

const isDark = ref(false)

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('darkMode', isDark.value.toString())
}

provide('isDark', isDark)
provide('toggleDarkMode', toggleDarkMode)

onMounted(() => {
  const saved = localStorage.getItem('darkMode')
  if (saved === 'true' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})
</script>
