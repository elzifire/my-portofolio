<template>
  <div class="bg-gray-800 rounded-2xl p-4 shadow-2xl w-full max-w-140 relative">

    <!-- Pause Overlay -->
    <div
      v-if="paused"
      class="absolute inset-0 bg-gray-900/80 backdrop-blur-sm rounded-2xl z-10 flex flex-col items-center justify-center"
    >
      <span class="text-5xl mb-3">⏸️</span>
      <p class="text-white text-xl font-bold mb-4">Game Paused</p>
      <button
        @click="$emit('resume')"
        class="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-500 transition-all hover:scale-105"
      >
        ▶️ Resume Game
      </button>
    </div>

    <!-- SVG Board -->
    <svg viewBox="0 0 600 600" class="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect x="0" y="0" width="600" height="600" rx="16" fill="#1f2937" />

      <!-- Home bases -->
      <g v-for="base in homeBases" :key="base.id">
        <rect v-bind="base.rect" rx="12" :fill="base.bgFill" :stroke="base.stroke" stroke-width="3" />
        <circle
          v-for="(pos, ci) in base.circles"
          :key="ci"
          :cx="pos[0]" :cy="pos[1]"
          r="18" :fill="base.circleFill" :stroke="base.stroke" stroke-width="2"
        />
      </g>

      <!-- Centre goal area -->
      <polygon points="300,248 248,300 300,352 352,300" fill="#374151" stroke="#4b5563" stroke-width="2" />
      <polygon points="300,258 258,300 300,295" fill="#ef4444" opacity="0.7" />
      <polygon points="300,258 342,300 300,295" fill="#3b82f6" opacity="0.7" />
      <polygon points="300,342 258,300 300,305" fill="#22c55e" opacity="0.7" />
      <polygon points="300,342 342,300 300,305" fill="#eab308" opacity="0.7" />
      <text x="300" y="305" text-anchor="middle" font-size="16" font-weight="bold" fill="white">★</text>

      <!-- Track cells (4 arms) -->
      <rect
        v-for="cell in allCells"
        :key="cell.key"
        :x="cell.x" :y="cell.y" width="36" height="36" rx="4"
        :fill="cell.fill" :stroke="cell.stroke" stroke-width="1.5"
      />

      <!-- Safe square markers -->
      <text
        v-for="(s, si) in safePositions"
        :key="'sf-' + si"
        :x="s.x + 18" :y="s.y + 24"
        text-anchor="middle" font-size="14" fill="#9ca3af"
      >✦</text>

      <!-- Pieces -->
      <g v-for="piece in pieces" :key="piece.name + '-' + piece.index">
        <circle
          :cx="piece.cx" :cy="piece.cy"
          r="13"
          :fill="piece.fill" :stroke="piece.stroke"
          stroke-width="2.5"
          :class="piece.selectable ? 'cursor-pointer' : ''"
          :opacity="piece.atGoal ? 0.5 : 1"
          @click="piece.selectable ? $emit('pieceClick', piece) : undefined"
        />
        <!-- Highlight ring -->
        <circle
          v-if="piece.selectable"
          :cx="piece.cx" :cy="piece.cy" r="16"
          fill="none" :stroke="piece.stroke"
          stroke-width="2" stroke-dasharray="4 3"
          class="animate-pulse"
        />
        <!-- Index label -->
        <text
          :x="piece.cx" :y="piece.cy + 4"
          text-anchor="middle" font-size="10" font-weight="bold" fill="white"
          pointer-events="none"
        >{{ piece.index + 1 }}</text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  HOME_POSITIONS,
  buildArmCells,
  TOP_ARM_CELLS, BOTTOM_ARM_CELLS, LEFT_ARM_CELLS, RIGHT_ARM_CELLS,
  RED_START, RED_SAFE_END,
  BLUE_START, BLUE_SAFE_END,
  GREEN_START, GREEN_SAFE_END,
  YELLOW_START, YELLOW_SAFE_END,
  SAFE_SQUARE_CELLS,
  cellXY,
} from '../../utils/ludoBoard'
import type { RenderedPiece } from '../../utils/ludoTypes'

defineProps<{
  pieces: RenderedPiece[]
  paused: boolean
}>()

defineEmits<{
  pieceClick: [piece: RenderedPiece]
  resume: []
}>()

// ─── Home bases (static) ─────────────────────────────────────────────────────

interface HomeBase {
  id: string
  rect: { x: number; y: number; width: number; height: number }
  bgFill: string
  stroke: string
  circleFill: string
  circles: [number, number][]
}

const homeBases: HomeBase[] = [
  { id: 'a', rect: { x: 10, y: 10, width: 230, height: 230 }, bgFill: '#fee2e2', stroke: '#ef4444', circleFill: '#fecaca', circles: HOME_POSITIONS.a! },
  { id: 'b', rect: { x: 360, y: 10, width: 230, height: 230 }, bgFill: '#dbeafe', stroke: '#3b82f6', circleFill: '#bfdbfe', circles: HOME_POSITIONS.b! },
  { id: 'c', rect: { x: 10, y: 360, width: 230, height: 230 }, bgFill: '#dcfce7', stroke: '#22c55e', circleFill: '#bbf7d0', circles: HOME_POSITIONS.c! },
  { id: 'd', rect: { x: 360, y: 360, width: 230, height: 230 }, bgFill: '#fef9c3', stroke: '#eab308', circleFill: '#fef08a', circles: HOME_POSITIONS.d! },
]

// ─── Track cells (static) ────────────────────────────────────────────────────

const topCells    = buildArmCells(TOP_ARM_CELLS, [RED_START, ...RED_SAFE_END])
const bottomCells = buildArmCells(BOTTOM_ARM_CELLS, [YELLOW_START, ...YELLOW_SAFE_END])
const leftCells   = buildArmCells(LEFT_ARM_CELLS, [GREEN_START, ...GREEN_SAFE_END])
const rightCells  = buildArmCells(RIGHT_ARM_CELLS, [BLUE_START, ...BLUE_SAFE_END])

const allCells = computed(() => {
  const withKey = (cells: typeof topCells, prefix: string) =>
    cells.map(c => ({ ...c, key: `${prefix}-${c.row}-${c.col}` }))
  return [
    ...withKey(topCells, 't'),
    ...withKey(bottomCells, 'b'),
    ...withKey(leftCells, 'l'),
    ...withKey(rightCells, 'r'),
  ]
})

// ─── Safe square markers ─────────────────────────────────────────────────────

const safePositions = SAFE_SQUARE_CELLS.map(c => {
  const [x, y] = cellXY(c.col, c.row)
  return { x, y }
})
</script>
