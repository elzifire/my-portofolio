<template>
  <div class="bg-gray-800 rounded-xl p-4 shadow-xl sticky top-4">
    <h3 class="text-white font-semibold mb-3 flex items-center gap-2 text-sm">📜 Move Log</h3>

    <div class="max-h-96 lg:max-h-115 overflow-y-auto space-y-1 custom-scroll">
      <div
        v-for="(log, i) in reversedLog"
        :key="i"
        class="text-xs py-1 px-2 rounded text-gray-300"
        :class="i % 2 === 0 ? 'bg-gray-700/50' : 'bg-gray-700/30'"
      >
        {{ log }}
      </div>
      <p v-if="logs.length === 0" class="text-gray-500 text-xs text-center py-4">No moves yet</p>
    </div>

    <!-- Rankings -->
    <div v-if="rankings.length > 0" class="mt-4 pt-3 border-t border-gray-700">
      <h4 class="text-xs text-gray-400 mb-2">🏆 Rankings</h4>
      <div v-for="(pid, idx) in rankings" :key="pid" class="flex items-center gap-2 text-sm py-1">
        <span class="text-yellow-400 font-bold w-5">{{ idx + 1 }}.</span>
        <div :class="['w-3 h-3 rounded-full', PLAYER_PRESETS[pid]?.color]" />
        <span class="text-white">{{ PLAYER_PRESETS[pid]?.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PLAYER_PRESETS } from '../../composables/useLudoGame'

const props = defineProps<{
  logs: string[]
  rankings: string[]
}>()

const reversedLog = computed(() => props.logs.slice().reverse())
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar { width: 6px; }
.custom-scroll::-webkit-scrollbar-track { background: #374151; border-radius: 3px; }
.custom-scroll::-webkit-scrollbar-thumb { background: #6b7280; border-radius: 3px; }
.custom-scroll::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
</style>
