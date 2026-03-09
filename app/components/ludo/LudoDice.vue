<template>
  <div class="bg-gray-800 rounded-xl p-4 shadow-xl text-center">
    <div class="text-xs text-gray-400 mb-3">Dice</div>

    <!-- 3D Dice Container -->
    <div class="perspective-400 mx-auto w-24 h-24 mb-3">
      <div
        :class="[
          'dice-cube w-full h-full relative',
          rolling ? 'animate-dice-roll' : 'transition-transform duration-500',
        ]"
        :style="!rolling ? faceTransform : undefined"
      >
        <!-- Front (1) -->
        <div class="dice-face dice-front bg-white rounded-xl flex items-center justify-center text-4xl font-bold text-gray-900 shadow-inner">⚀</div>
        <!-- Back (6) -->
        <div class="dice-face dice-back bg-white rounded-xl flex items-center justify-center text-4xl font-bold text-gray-900 shadow-inner">⚅</div>
        <!-- Right (2) -->
        <div class="dice-face dice-right bg-white rounded-xl flex items-center justify-center text-4xl font-bold text-gray-900 shadow-inner">⚁</div>
        <!-- Left (5) -->
        <div class="dice-face dice-left bg-white rounded-xl flex items-center justify-center text-4xl font-bold text-gray-900 shadow-inner">⚄</div>
        <!-- Top (3) -->
        <div class="dice-face dice-top bg-white rounded-xl flex items-center justify-center text-4xl font-bold text-gray-900 shadow-inner">⚂</div>
        <!-- Bottom (4) -->
        <div class="dice-face dice-bottom bg-white rounded-xl flex items-center justify-center text-4xl font-bold text-gray-900 shadow-inner">⚃</div>
      </div>
    </div>

    <!-- Value text -->
    <p v-if="value > 0 && !rolling" class="text-white font-bold text-lg mb-2">
      Rolled a {{ value }}
      <span v-if="value === 6" class="text-yellow-400">🔥</span>
    </p>
    <p v-else-if="!rolling" class="text-gray-500 text-sm mb-2">Ready to roll</p>

    <!-- Roll button (human only) -->
    <button
      v-if="canRoll && !isBotTurn"
      @click="$emit('roll')"
      class="w-full px-4 py-2.5 bg-linear-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold hover:scale-105 transition-all shadow-lg shadow-orange-500/30 active:scale-95"
    >
      🎲 Roll Dice
    </button>

    <!-- Bot thinking -->
    <div v-else-if="isBotTurn && canRoll" class="text-yellow-400 text-sm flex items-center justify-center gap-2">
      <span class="animate-spin">⚙️</span> Bot thinking…
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  value: number
  rolling: boolean
  canRoll: boolean
  isBotTurn: boolean
}>()

defineEmits<{ roll: [] }>()

/** Map dice value → CSS rotation so the correct face points forward */
const FACE_ROTATIONS: Record<number, string> = {
  1: 'rotateY(0deg)',
  2: 'rotateY(-90deg)',
  3: 'rotateX(90deg)',
  4: 'rotateX(-90deg)',
  5: 'rotateY(90deg)',
  6: 'rotateY(180deg)',
}

const faceTransform = computed(() => {
  if (props.value < 1 || props.value > 6) return { transform: 'rotateY(0deg)' }
  return { transform: FACE_ROTATIONS[props.value] }
})
</script>

<style scoped>
/* ─── Perspective container ── */
.perspective-400 {
  perspective: 400px;
}

/* ─── Cube ── */
.dice-cube {
  transform-style: preserve-3d;
}

/* ─── Faces ── */
.dice-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border: 2px solid #d1d5db;
}

.dice-front  { transform: translateZ(48px); }
.dice-back   { transform: rotateY(180deg) translateZ(48px); }
.dice-right  { transform: rotateY(90deg) translateZ(48px); }
.dice-left   { transform: rotateY(-90deg) translateZ(48px); }
.dice-top    { transform: rotateX(90deg) translateZ(48px); }
.dice-bottom { transform: rotateX(-90deg) translateZ(48px); }

/* ─── Roll animation ── */
@keyframes diceRoll {
  0%   { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
  20%  { transform: rotateX(180deg) rotateY(90deg) rotateZ(45deg); }
  40%  { transform: rotateX(360deg) rotateY(180deg) rotateZ(-30deg); }
  60%  { transform: rotateX(540deg) rotateY(270deg) rotateZ(60deg); }
  80%  { transform: rotateX(630deg) rotateY(360deg) rotateZ(-15deg); }
  100% { transform: rotateX(720deg) rotateY(450deg) rotateZ(0deg); }
}

.animate-dice-roll {
  animation: diceRoll 0.6s cubic-bezier(0.2, 0.9, 0.3, 1);
}
</style>
