<template>
  <div class="fixed bottom-4 right-4 z-50">
    <!-- Expanded Player -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-90"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-90"
    >
      <div
        v-if="expanded"
        class="glass-player rounded-2xl p-4 mb-3 w-72 shadow-2xl"
      >
        <div class="flex items-center justify-between mb-3">
          <span class="text-white text-sm font-semibold">🎵 {{ $t('music.title') }}</span>
          <button @click="expanded = false" class="text-gray-400 hover:text-white transition-colors text-lg leading-none">&times;</button>
        </div>

        <!-- Track Info -->
        <div class="mb-3">
          <p class="text-white text-xs font-medium truncate">{{ lofi.currentTrack.value.title }}</p>
          <p class="text-gray-400 text-[10px] truncate">{{ lofi.currentTrack.value.artist }}</p>
        </div>

        <!-- Progress -->
        <div class="mb-3">
          <div class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div class="h-full bg-linear-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-200" :style="{ width: lofi.progressPct.value + '%' }"></div>
          </div>
          <div class="flex justify-between text-[10px] text-gray-500 mt-1">
            <span>{{ lofi.formatTime(lofi.currentTime.value) }}</span>
            <span>{{ lofi.formatTime(lofi.duration.value) }}</span>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex items-center justify-center gap-4">
          <button @click="lofi.prevTrack()" class="text-gray-400 hover:text-white transition-colors text-lg">⏮</button>
          <button @click="lofi.togglePlay()" class="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg hover:scale-110 transition-transform">
            {{ lofi.isPlaying.value ? '⏸' : '▶' }}
          </button>
          <button @click="lofi.nextTrack()" class="text-gray-400 hover:text-white transition-colors text-lg">⏭</button>
        </div>

        <!-- Volume -->
        <div class="flex items-center gap-2 mt-3">
          <button @click="lofi.toggleMute()" class="text-gray-400 hover:text-white text-sm">
            {{ lofi.isMuted.value ? '🔇' : '🔊' }}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            :value="lofi.isMuted.value ? 0 : lofi.volume.value"
            @input="onVolume"
            class="flex-1 h-1 appearance-none bg-white/10 rounded-full accent-purple-500 cursor-pointer"
          />
        </div>

        <!-- Track List -->
        <div class="mt-3 max-h-32 overflow-y-auto space-y-1 scrollbar-thin">
          <button
            v-for="(track, i) in lofi.tracks"
            :key="i"
            @click="lofi.playTrack(i)"
            class="w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors truncate"
            :class="i === lofi.trackIndex.value ? 'bg-purple-500/20 text-purple-300' : 'text-gray-400 hover:bg-white/5 hover:text-white'"
          >
            {{ track.title }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- Floating Button -->
    <button
      @click="expanded = !expanded"
      class="w-14 h-14 rounded-full bg-linear-to-r from-blue-500 to-purple-500 shadow-lg flex items-center justify-center text-2xl text-white hover:scale-110 transition-all duration-300"
      :class="{ 'animate-pulse-slow': lofi.isPlaying.value && !expanded }"
    >
      🎵
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useLofiMusic } from '~/composables/useLofiMusic'

const expanded = ref(false)
const lofi = useLofiMusic()

function onVolume(e: Event) {
  const val = parseInt((e.target as HTMLInputElement).value)
  lofi.setVolume(val)
}

onUnmounted(() => {
  lofi.destroy()
})
</script>

<style scoped>
.glass-player {
  background: rgba(15, 15, 25, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.animate-pulse-slow {
  animation: pulseSlow 2s ease-in-out infinite;
}

@keyframes pulseSlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(139, 92, 246, 0); }
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #a78bfa;
  cursor: pointer;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
</style>
