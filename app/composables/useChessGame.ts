/**
 * Chess Game State Composable
 * Manages the game state, history, and localStorage
 */

import { ref, onMounted } from 'vue'

export type GameMode = 'multiplayer' | 'bot'

export interface SavedGame {
  date: string
  mode: GameMode
  difficulty?: string
  moves: string[]
  result: string
  playerColor?: 'w' | 'b'
}

const GAMES_KEY = 'chess_saved_games'

export const useChessGame = () => {
  // Game state
  const gameStarted = ref(false)
  const selectedMode = ref<GameMode | null>(null)
  const selectedDifficulty = ref(2)
  const playerColor = ref<'w' | 'b'>('w')
  const currentTurn = ref<'w' | 'b'>('w')
  const gameStatus = ref('')
  const moveHistory = ref<string[]>([])
  const isBotThinking = ref(false)
  const previousGames = ref<SavedGame[]>([])

  // Load saved games from localStorage
  const loadSavedGames = () => {
    try {
      const saved = localStorage.getItem(GAMES_KEY)
      if (saved) {
        previousGames.value = JSON.parse(saved)
      }
    } catch (e) {
      console.error('Failed to load saved games:', e)
    }
  }

  // Save game to localStorage
  const saveGame = (result: string) => {
    try {
      const game: SavedGame = {
        date: new Date().toLocaleString(),
        mode: selectedMode.value!,
        difficulty: selectedMode.value === 'bot' 
          ? getDifficultyName(selectedDifficulty.value) 
          : undefined,
        moves: [...moveHistory.value],
        result,
        playerColor: selectedMode.value === 'bot' ? playerColor.value : undefined
      }
      previousGames.value.push(game)
      localStorage.setItem(GAMES_KEY, JSON.stringify(previousGames.value))
    } catch (e) {
      console.error('Failed to save game:', e)
    }
  }

  // Clear history
  const clearHistory = () => {
    previousGames.value = []
    localStorage.removeItem(GAMES_KEY)
  }

  // Get difficulty name
  const getDifficultyName = (index: number): string => {
    const names = ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert']
    return names[index] || 'Medium'
  }

  // Initialize on mount
  onMounted(() => {
    loadSavedGames()
  })

  return {
    gameStarted,
    selectedMode,
    selectedDifficulty,
    playerColor,
    currentTurn,
    gameStatus,
    moveHistory,
    isBotThinking,
    previousGames,
    loadSavedGames,
    saveGame,
    clearHistory,
    getDifficultyName
  }
}
