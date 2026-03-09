<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <div class="bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-md w-full text-center animate-bounce-in">
          <div class="text-6xl mb-4">🏆</div>
          <h2 class="text-2xl font-bold text-white mb-2">Game Over!</h2>
          <p class="text-lg text-gray-300 mb-6">{{ message }}</p>

          <!-- Final Rankings -->
          <div class="space-y-2 mb-6">
            <div
              v-for="(pid, idx) in finalRankings"
              :key="pid"
              :class="[
                'flex items-center gap-3 px-4 py-2 rounded-lg',
                idx === 0 ? 'bg-yellow-500/20 border border-yellow-500/50' : 'bg-gray-700/50',
              ]"
            >
              <span
                class="text-lg font-bold w-6"
                :class="idx === 0 ? 'text-yellow-400' : 'text-gray-400'"
              >{{ idx + 1 }}</span>
              <div :class="['w-5 h-5 rounded-full', PLAYER_PRESETS[pid]?.color]" />
              <span class="text-white font-medium">{{ PLAYER_PRESETS[pid]?.label }}</span>
              <span v-if="idx === 0" class="ml-auto text-yellow-400 text-sm">Winner!</span>
            </div>
          </div>

          <!-- Match Stats -->
          <div v-if="stats" class="bg-gray-700/50 rounded-xl p-4 mb-6 text-left space-y-2">
            <h4 class="text-xs text-gray-400 uppercase tracking-wide mb-2 text-center">Match Stats</h4>
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Total Moves</span>
              <span class="text-white font-medium">{{ stats.totalMoves }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Captures</span>
              <span class="text-white font-medium">{{ stats.captures }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Highest Streak</span>
              <span class="text-white font-medium">{{ stats.highestStreak }} sixes</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 justify-center">
            <button
              @click="$emit('menu')"
              class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-all"
            >
              🔙 Menu
            </button>
            <button
              @click="$emit('playAgain')"
              class="px-6 py-3 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:scale-105 transition-all shadow-lg"
            >
              🔄 Play Again
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { PLAYER_PRESETS } from '../../composables/useLudoGame'
import type { MatchStats } from '../../utils/ludoTypes'

defineProps<{
  visible: boolean
  message: string
  finalRankings: string[]
  stats: MatchStats | null
}>()

defineEmits<{
  menu: []
  playAgain: []
}>()
</script>

<style scoped>
.animate-bounce-in {
  animation: bounceIn 0.4s ease-out;
}

@keyframes bounceIn {
  0%   { transform: scale(0.7); opacity: 0; }
  60%  { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
