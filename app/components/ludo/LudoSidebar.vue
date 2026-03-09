<template>
  <div class="space-y-3">
    <!-- Current Turn -->
    <div class="bg-gray-800 rounded-xl p-4 shadow-xl">
      <div class="text-xs text-gray-400 mb-2">Current Turn</div>
      <div class="flex items-center gap-2">
        <div :class="['w-6 h-6 rounded-full shadow', PLAYER_PRESETS[currentPlayer]?.color]" />
        <span class="text-white font-semibold">{{ PLAYER_PRESETS[currentPlayer]?.label ?? '?' }}</span>
        <span
          v-if="isBotTurn"
          class="text-xs bg-purple-600/30 text-purple-300 px-2 py-0.5 rounded-full ml-auto"
        >BOT</span>
      </div>
    </div>

    <!-- Dice -->
    <LudoDice
      :value="diceValue"
      :rolling="diceRolling"
      :can-roll="canRoll"
      :is-bot-turn="isBotTurn"
      @roll="$emit('roll')"
    />

    <!-- Status message -->
    <div v-if="message" class="bg-gray-800 rounded-xl p-3 shadow-xl">
      <p class="text-sm text-gray-300 text-center">{{ message }}</p>
    </div>

    <!-- Player Progress -->
    <div class="bg-gray-800 rounded-xl p-4 shadow-xl">
      <div class="text-xs text-gray-400 mb-3">Progress</div>
      <div class="space-y-2">
        <div
          v-for="p in players"
          :key="p.id"
          :class="[
            'flex items-center gap-2 p-2 rounded-lg transition-all',
            currentPlayer === p.id ? PLAYER_PRESETS[p.id]?.lightBg : 'bg-gray-700/30',
          ]"
        >
          <div :class="['w-4 h-4 rounded-full', PLAYER_PRESETS[p.id]?.color]" />
          <span class="text-white text-sm font-medium flex-1">{{ p.label }}</span>
          <div class="flex gap-0.5">
            <div
              v-for="i in 4"
              :key="i"
              :class="[
                'w-3 h-3 rounded-full border transition-all',
                getGoalCount(p.id) >= i
                  ? PLAYER_PRESETS[p.id]?.color + ' ' + PLAYER_PRESETS[p.id]?.borderColor
                  : 'bg-gray-600 border-gray-500',
              ]"
            />
          </div>
          <span class="text-xs text-gray-400">{{ getGoalCount(p.id) }}/4</span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="space-y-2">
      <button
        v-if="!isPaused && !isOver"
        @click="$emit('pause')"
        class="w-full px-4 py-2.5 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl transition-colors flex items-center justify-center gap-2 font-medium"
      >
        ⏸️ Pause
      </button>
      <button
        v-if="isPaused"
        @click="$emit('resume')"
        class="w-full px-4 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl transition-colors flex items-center justify-center gap-2 font-medium"
      >
        ▶️ Resume
      </button>
      <button
        @click="$emit('reset')"
        class="w-full px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        🔙 Back to Menu
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PLAYER_PRESETS, type PlayerConfig } from '../../composables/useLudoGame'

defineProps<{
  currentPlayer: string
  players: PlayerConfig[]
  diceValue: number
  diceRolling: boolean
  canRoll: boolean
  isBotTurn: boolean
  isPaused: boolean
  isOver: boolean
  message: string
  getGoalCount: (id: string) => number
}>()

defineEmits<{
  roll: []
  pause: []
  resume: []
  reset: []
}>()
</script>
