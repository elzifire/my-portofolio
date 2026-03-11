<template>
  <div class="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-4 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-4">
        <NuxtLink to="/games" class="inline-block mb-3 text-gray-400 hover:text-white transition-colors text-sm">
          &larr; {{ $t('games.backToGames') }}
        </NuxtLink>
        <h1 class="text-3xl sm:text-4xl font-bold text-white mb-1 flex items-center justify-center gap-3">
          <span class="text-3xl">🧱</span> {{ $t('breakoutGame.title') }}
        </h1>
        <p class="text-gray-400 text-sm">{{ $t('breakoutGame.subtitle') }}</p>
      </div>

      <!-- ============ WORLD MAP ============ -->
      <div v-if="screen === 'map'" class="space-y-4">
        <!-- Total stats bar -->
        <div class="glass-card rounded-2xl p-4 flex flex-wrap justify-center gap-4 sm:gap-6">
          <div class="text-center">
            <div class="text-2xl font-bold text-yellow-400">{{ totalStars }}</div>
            <div class="text-xs text-gray-400">⭐ {{ $t('breakoutGame.totalStars') }}</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-400">{{ highestLevel }}</div>
            <div class="text-xs text-gray-400">🏔️ {{ $t('breakoutGame.highestLevel') }}</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-400">{{ totalScore }}</div>
            <div class="text-xs text-gray-400">🎯 {{ $t('breakoutGame.bestScore') }}</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-400">{{ unlockedAchievements.length }}/{{ allAchievements.length }}</div>
            <div class="text-xs text-gray-400">🏆 {{ $t('breakoutGame.achievements') }}</div>
          </div>
        </div>

        <!-- Level Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button
            v-for="(lvl, i) in LEVELS"
            :key="i"
            @click="selectLevel(i)"
            :disabled="!isLevelUnlocked(i)"
            class="glass-card rounded-xl p-3 text-center transition-all relative overflow-hidden group"
            :class="isLevelUnlocked(i)
              ? 'hover:scale-105 hover:border-blue-500/50 cursor-pointer'
              : 'opacity-40 cursor-not-allowed'"
          >
            <div class="absolute inset-0 opacity-20 rounded-xl" :style="{ background: lvl.accent }"></div>
            <div class="relative">
              <div class="text-3xl mb-1">{{ isLevelUnlocked(i) ? lvl.emoji : '🔒' }}</div>
              <div class="text-xs font-bold text-white mb-1">{{ lvl.name }}</div>
              <div class="text-[10px] text-gray-400">Lv.{{ i + 1 }}</div>
              <div v-if="getSavedLevel(i)" class="flex justify-center gap-0.5 mt-1">
                <span v-for="s in 3" :key="s" class="text-xs">
                  {{ s <= (getSavedLevel(i)?.stars || 0) ? '⭐' : '☆' }}
                </span>
              </div>
            </div>
          </button>
        </div>

        <!-- Achievements Panel -->
        <div class="glass-card rounded-2xl p-4">
          <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
            🏆 {{ $t('breakoutGame.achievements') }}
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div
              v-for="ach in allAchievements"
              :key="ach.id"
              class="flex items-center gap-3 p-2 rounded-lg transition-all"
              :class="isAchievementUnlocked(ach.id) ? 'bg-white/10' : 'bg-white/5 opacity-50'"
            >
              <span class="text-2xl">{{ isAchievementUnlocked(ach.id) ? ach.emoji : '🔒' }}</span>
              <div>
                <div class="text-sm font-semibold text-white">{{ ach.title }}</div>
                <div class="text-xs text-gray-400">{{ ach.desc }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reset Button -->
        <div class="text-center">
          <button
            @click="showResetConfirm = true"
            class="px-4 py-2 rounded-lg text-xs font-medium text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-all"
          >
            🗑️ {{ $t('breakoutGame.resetProgress') }}
          </button>
        </div>

        <!-- Reset Confirm Modal -->
        <div v-if="showResetConfirm" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" @click.self="showResetConfirm = false">
          <div class="glass-card rounded-2xl p-6 max-w-sm w-full text-center">
            <div class="text-4xl mb-3">⚠️</div>
            <h3 class="text-xl font-bold text-white mb-2">{{ $t('breakoutGame.resetConfirmTitle') }}</h3>
            <p class="text-gray-400 text-sm mb-5">{{ $t('breakoutGame.resetConfirmDesc') }}</p>
            <div class="flex gap-3 justify-center">
              <button @click="showResetConfirm = false" class="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gray-700 hover:bg-gray-600 transition-all">
                {{ $t('breakoutGame.cancel') }}
              </button>
              <button @click="resetAllProgress" class="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all">
                {{ $t('breakoutGame.resetConfirmBtn') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ============ LEVEL INTRO ============ -->
      <div v-else-if="screen === 'intro'" class="glass-card rounded-2xl p-6 sm:p-8 text-center">
        <div class="text-6xl mb-4">{{ currentLevelDef.emoji }}</div>
        <div class="text-xs text-gray-400 mb-1 uppercase tracking-wider">Level {{ currentLevel + 1 }}</div>
        <h2 class="text-2xl font-bold text-white mb-2">{{ currentLevelDef.name }}</h2>
        <p class="text-gray-400 text-sm mb-5 max-w-xs mx-auto">{{ currentLevelDef.desc }}</p>

        <div class="glass-card inline-block rounded-xl p-3 mb-5">
          <div class="text-xs text-gray-400 mb-2">{{ $t('breakoutGame.starTargets') }}</div>
          <div class="flex gap-4 text-sm text-gray-300">
            <span>⭐ {{ $t('breakoutGame.clear') }}</span>
            <span>⭐⭐ {{ currentLevelDef.star2Label }}</span>
            <span>⭐⭐⭐ {{ currentLevelDef.star3Label }}</span>
          </div>
        </div>

        <div class="flex gap-3 justify-center">
          <button @click="screen = 'map'" class="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gray-700 hover:bg-gray-600 transition-all">
            ← {{ $t('breakoutGame.back') }}
          </button>
          <button @click="launchLevel" class="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg">
            🚀 {{ $t('breakoutGame.play') }}
          </button>
        </div>
      </div>

      <!-- ============ GAMEPLAY ============ -->
      <div v-else-if="screen === 'play'" class="space-y-3">
        <div class="flex justify-center gap-2 sm:gap-3 flex-wrap">
          <div class="glass-card rounded-xl px-3 py-1.5 text-center">
            <span class="text-lg font-bold text-yellow-400">{{ score }}</span>
            <span class="text-[10px] text-gray-400 ml-1">{{ $t('breakoutGame.score') }}</span>
          </div>
          <div class="glass-card rounded-xl px-3 py-1.5 text-center">
            <span class="text-lg font-bold text-red-400">{{ '❤️'.repeat(lives) }}</span>
          </div>
          <div class="glass-card rounded-xl px-3 py-1.5 text-center">
            <span class="text-lg font-bold text-green-400">{{ combo }}x</span>
            <span class="text-[10px] text-gray-400 ml-1">{{ $t('breakoutGame.combo') }}</span>
          </div>
          <div class="glass-card rounded-xl px-3 py-1.5 text-center">
            <span class="text-lg font-bold text-blue-400">{{ formattedTime }}</span>
            <span class="text-[10px] text-gray-400 ml-1">{{ $t('breakoutGame.time') }}</span>
          </div>
        </div>

        <div v-if="activePowerUps.length" class="flex justify-center gap-2">
          <span v-for="(pu, i) in activePowerUps" :key="i" class="text-lg animate-bounce" :title="pu.type">
            {{ POWERUP_EMOJI[pu.type] }}
          </span>
        </div>

        <div class="glass-card rounded-2xl p-2 sm:p-3 relative">
          <canvas
            ref="canvasRef"
            :width="CW"
            :height="CH"
            @mousemove="onMouseMove"
            @touchmove.prevent="onTouchMove"
            class="mx-auto block rounded-xl cursor-pointer border border-gray-700"
            :style="{ maxWidth: '100%', height: 'auto' }"
          />
        </div>

        <p class="text-center text-gray-500 text-xs">{{ $t('breakoutGame.instructions') }}</p>
      </div>

      <!-- ============ LEVEL COMPLETE ============ -->
      <div v-else-if="screen === 'complete'" class="glass-card rounded-2xl p-6 sm:p-8 text-center">
        <div class="text-5xl mb-3">{{ levelWon ? '🎉' : '💥' }}</div>
        <h2 class="text-2xl font-bold text-white mb-2">
          {{ levelWon ? $t('breakoutGame.levelCleared') : $t('breakoutGame.gameOver') }}
        </h2>

        <div v-if="levelWon" class="space-y-4 mb-6">
          <div class="flex justify-center gap-2 text-4xl">
            <span v-for="s in 3" :key="s" :class="s <= earnedStars ? 'scale-110' : 'opacity-30 grayscale'">
              {{ s <= earnedStars ? '⭐' : '☆' }}
            </span>
          </div>
          <div class="glass-card inline-block rounded-xl p-3">
            <div class="text-sm text-gray-300">{{ $t('breakoutGame.score') }}: <span class="font-bold text-yellow-400">{{ score }}</span></div>
            <div class="text-sm text-gray-300">{{ $t('breakoutGame.time') }}: <span class="font-bold text-blue-400">{{ formattedTime }}</span></div>
            <div class="text-sm text-gray-300">{{ $t('breakoutGame.maxCombo') }}: <span class="font-bold text-green-400">{{ maxCombo }}x</span></div>
          </div>
          <div v-if="newAchievements.length" class="space-y-2">
            <div class="text-sm font-semibold text-yellow-400">🏆 {{ $t('breakoutGame.newAchievements') }}</div>
            <div v-for="ach in newAchievements" :key="ach.id" class="glass-card rounded-lg p-2 inline-flex items-center gap-2 mx-1">
              <span class="text-xl">{{ ach.emoji }}</span>
              <span class="text-sm font-medium text-white">{{ ach.title }}</span>
            </div>
          </div>
        </div>

        <div v-else class="mb-6">
          <div class="glass-card inline-block rounded-xl p-3">
            <div class="text-sm text-gray-300">{{ $t('breakoutGame.score') }}: <span class="font-bold text-yellow-400">{{ score }}</span></div>
          </div>
        </div>

        <div class="flex gap-3 justify-center flex-wrap">
          <button @click="screen = 'map'" class="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gray-700 hover:bg-gray-600 transition-all">
            🗺️ {{ $t('breakoutGame.toMap') }}
          </button>
          <button @click="retryLevel" class="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all">
            🔄 {{ $t('breakoutGame.retry') }}
          </button>
          <button
            v-if="levelWon && currentLevel < LEVELS.length - 1"
            @click="goNextLevel"
            class="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
          >
            ➡️ {{ $t('breakoutGame.nextLevel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
console.log('[Breakout Page] Component mounted')

const canvasRef = ref<HTMLCanvasElement | null>(null)

console.log('[Breakout Page] canvasRef created:', canvasRef)

const {
  LEVELS, CW, CH, POWERUP_EMOJI,
  screen, showResetConfirm, currentLevel, currentLevelDef,
  totalStars, highestLevel, totalScore, unlockedAchievements, allAchievements,
  score, lives, combo, maxCombo, formattedTime, levelWon, earnedStars, newAchievements, activePowerUps,
  selectLevel, getSavedLevel, isLevelUnlocked, isAchievementUnlocked,
  resetAllProgress, launchLevel, retryLevel, goNextLevel,
  onMouseMove, onTouchMove,
} = useBreakoutGame(canvasRef)

console.log('[Breakout Page] useBreakoutGame initialized')
console.log('[Breakout Page] LEVELS count:', LEVELS?.length)
console.log('[Breakout Page] screen:', screen)
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
