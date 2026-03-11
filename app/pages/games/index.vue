<template>
  <div class="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-6 px-4">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-10">
        <NuxtLink to="/" class="inline-block mb-4 text-gray-400 hover:text-white transition-colors text-sm">
          &larr; {{ $t('games.backToPortfolio') }}
        </NuxtLink>
        <h1 class="text-4xl sm:text-5xl font-bold text-white mb-3">
          🎮 {{ $t('games.title') }}
        </h1>
        <p class="text-gray-400 text-lg">{{ $t('games.subtitle') }}</p>
      </div>

      <!-- Games Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <NuxtLink
          v-for="game in gamesList"
          :key="game.route"
          :to="game.route"
          class="game-card glass-card rounded-2xl p-6 group cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
        >
          <div class="text-5xl mb-4">{{ game.emoji }}</div>
          <h3 class="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {{ game.name }}
          </h3>
          <p class="text-gray-400 text-sm mb-4 leading-relaxed">{{ game.desc }}</p>
          <div class="flex items-center gap-2 flex-wrap">
            <span
              v-for="tag in game.tags"
              :key="tag"
              class="px-2.5 py-1 text-xs font-medium rounded-full bg-white/10 text-gray-300"
            >
              {{ tag }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { t } = useI18n()

const gamesList = computed(() => [
  {
    emoji: '♟️',
    name: t('games.chess.name'),
    desc: t('games.chess.desc'),
    route: '/chess',
    tags: [t('games.tags.strategy'), t('games.tags.ai'), t('games.tags.multiplayer')],
  },
  {
    emoji: '🐍',
    name: t('games.snake.name'),
    desc: t('games.snake.desc'),
    route: '/snake',
    tags: [t('games.tags.arcade'), t('games.tags.classic')],
  },
  {
    emoji: '🎲',
    name: t('games.ludo.name'),
    desc: t('games.ludo.desc'),
    route: '/ludo',
    tags: [t('games.tags.board'), t('games.tags.multiplayer')],
  },
  {
    emoji: '❌',
    name: t('games.tictactoe.name'),
    desc: t('games.tictactoe.desc'),
    route: '/tictactoe',
    tags: [t('games.tags.strategy'), t('games.tags.ai')],
  },
  {
    emoji: '🧠',
    name: t('games.memory.name'),
    desc: t('games.memory.desc'),
    route: '/memory',
    tags: [t('games.tags.puzzle'), t('games.tags.brain')],
  },
  {
    emoji: '🔢',
    name: t('games.g2048.name'),
    desc: t('games.g2048.desc'),
    route: '/2048',
    tags: [t('games.tags.puzzle'), t('games.tags.classic')],
  },
  {
    emoji: '📝',
    name: t('games.wordle.name'),
    desc: t('games.wordle.desc'),
    route: '/wordle',
    tags: [t('games.tags.word'), t('games.tags.brain')],
  },
  {
    emoji: '💣',
    name: t('games.minesweeper.name'),
    desc: t('games.minesweeper.desc'),
    route: '/minesweeper',
    tags: [t('games.tags.puzzle'), t('games.tags.classic')],
  },
  {
    emoji: '⌨️',
    name: t('games.typingtest.name'),
    desc: t('games.typingtest.desc'),
    route: '/typingtest',
    tags: [t('games.tags.skill'), t('games.tags.speed')],
  },
  {
    emoji: '🎨',
    name: t('games.colorguess.name'),
    desc: t('games.colorguess.desc'),
    route: '/colorguess',
    tags: [t('games.tags.puzzle'), t('games.tags.brain')],
  },
  {
    emoji: '⚡',
    name: t('games.reactiontime.name'),
    desc: t('games.reactiontime.desc'),
    route: '/reactiontime',
    tags: [t('games.tags.skill'), t('games.tags.speed')],
  },
  {
    emoji: '🧩',
    name: t('games.sudoku.name'),
    desc: t('games.sudoku.desc'),
    route: '/sudoku',
    tags: [t('games.tags.puzzle'), t('games.tags.brain')],
  },
  {
    emoji: '🐦',
    name: t('games.flappybird.name'),
    desc: t('games.flappybird.desc'),
    route: '/flappybird',
    tags: [t('games.tags.arcade'), t('games.tags.skill')],
  },
  {
    emoji: '🧱',
    name: t('games.breakout.name'),
    desc: t('games.breakout.desc'),
    route: '/breakout',
    tags: [t('games.tags.arcade'), t('games.tags.classic')],
  },
])
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.game-card:hover {
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.1);
}
</style>
