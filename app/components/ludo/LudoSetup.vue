<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div class="bg-gray-800 rounded-2xl p-6 shadow-2xl">
      <h2 class="text-xl font-semibold text-white mb-5 text-center">Game Setup</h2>

      <!-- Player count -->
      <div class="flex items-center justify-center gap-3 mb-5">
        <span class="text-gray-400 text-sm">Players:</span>
        <div class="flex gap-2">
          <button
            v-for="n in [2, 3, 4]"
            :key="n"
            @click="setPlayerCount(n)"
            :class="[
              'w-10 h-10 rounded-lg font-bold transition-all',
              activeCount === n
                ? 'bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-500/40'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
            ]"
          >
            {{ n }}
          </button>
        </div>
      </div>

      <!-- Player Slots -->
      <div class="space-y-3 mb-6">
        <div
          v-for="slot in slots"
          :key="slot.id"
          :class="[
            'flex items-center gap-3 rounded-xl p-3 transition-all',
            slot.type === 'none' ? 'bg-gray-700/20 opacity-50' : 'bg-gray-700/50',
          ]"
        >
          <!-- Color dot -->
          <div :class="['w-8 h-8 rounded-full shrink-0 shadow-lg', PLAYER_PRESETS[slot.id]?.color]" />

          <!-- Label -->
          <span class="text-white font-medium w-16">{{ PLAYER_PRESETS[slot.id]?.label }}</span>

          <!-- Type selector (only for active slots) -->
          <div v-if="slot.type !== 'none'" class="flex gap-2 flex-1">
            <button
              v-for="opt in typeOptions"
              :key="opt.value"
              @click="slot.type = opt.value"
              :class="[
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                slot.type === opt.value ? opt.activeClass : 'bg-gray-600 text-gray-300 hover:bg-gray-500',
              ]"
            >
              {{ opt.label }}
            </button>
          </div>

          <span v-else class="text-gray-500 text-sm italic flex-1">Disabled</span>
        </div>
      </div>

      <!-- Sound Toggle -->
      <div class="flex items-center justify-center gap-3 mb-5 border-t border-gray-700 pt-5">
        <button
          @click="$emit('update:soundEnabled', !soundEnabled)"
          class="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
          :class="soundEnabled ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'"
        >
          {{ soundEnabled ? '🔊 Sound On' : '🔇 Sound Off' }}
        </button>
      </div>

      <!-- Start Button -->
      <div class="text-center">
        <button
          @click="$emit('start', activeSlots)"
          :disabled="activeSlots.length < 2"
          :class="[
            'px-8 py-3 rounded-xl font-bold text-lg transition-all flex items-center gap-2 mx-auto',
            activeSlots.length >= 2
              ? 'bg-linear-to-r from-green-500 to-emerald-600 text-white hover:scale-105 hover:shadow-xl hover:shadow-green-500/30'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed',
          ]"
        >
          🎮 Start Game
        </button>
        <p v-if="activeSlots.length < 2" class="text-gray-500 text-xs mt-2">Select at least 2 players</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PLAYER_PRESETS } from '../../composables/useLudoGame'
import type { PlayerSlot } from '../../utils/ludoTypes'

const props = defineProps<{ soundEnabled: boolean }>()
defineEmits<{
  start: [slots: PlayerSlot[]]
  'update:soundEnabled': [val: boolean]
}>()

const typeOptions = [
  { value: 'human' as const, label: '👤 Human', activeClass: 'bg-blue-600 text-white' },
  { value: 'bot' as const, label: '🤖 Bot', activeClass: 'bg-purple-600 text-white' },
]

const slots = ref<PlayerSlot[]>([
  { id: 'a', type: 'human' },
  { id: 'b', type: 'bot' },
  { id: 'c', type: 'bot' },
  { id: 'd', type: 'none' },
])

const activeCount = computed(() => slots.value.filter(s => s.type !== 'none').length)
const activeSlots = computed(() => slots.value.filter(s => s.type !== 'none'))

function setPlayerCount(n: number) {
  const defaults: ('human' | 'bot')[] = ['human', 'bot', 'bot', 'bot']
  slots.value.forEach((s, i) => {
    if (i < n) {
      // Keep current type if already active, otherwise set default
      if (s.type === 'none') s.type = defaults[i] ?? 'bot'
    } else {
      s.type = 'none'
    }
  })
}
</script>
