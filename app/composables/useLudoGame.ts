/**
 * Ludo Game Composable
 *
 * Wraps @nanowiz/ludo.js in reactive Vue state.
 * Handles:
 *  - game lifecycle (init, reset, pause, resume)
 *  - bot AI (simple weighted random)
 *  - turn management, dice rolling, move selection
 *  - piece + board state exposed as reactive refs
 */

import { ref, computed, type Ref } from 'vue'
import {
  init as ludoInit,
  turn as ludoTurn,
  moves as ludoMoves,
  move as ludoMove,
  on as ludoOn,
  position as ludoPosition,
  square as ludoSquare,
  type LudoMove,
  type LudoPiece,
  type LudoSquare,
  type MoveType,
} from '@nanowiz/ludo.js'
import { pickBestMove } from '../utils/ludoBot'

// ─── Player colours & metadata ───────────────────────────────────────────────

export interface PlayerConfig {
  id: string          // 'a' | 'b' | 'c' | 'd'
  label: string       // "Red" etc.
  color: string       // tailwind bg class
  textColor: string
  borderColor: string
  lightBg: string
  isBot: boolean
}

export const PLAYER_PRESETS: Record<string, Omit<PlayerConfig, 'id' | 'isBot'>> = {
  a: { label: 'Red',    color: 'bg-red-500',    textColor: 'text-red-400',    borderColor: 'border-red-500',    lightBg: 'bg-red-500/20' },
  b: { label: 'Blue',   color: 'bg-blue-500',   textColor: 'text-blue-400',   borderColor: 'border-blue-500',   lightBg: 'bg-blue-500/20' },
  c: { label: 'Green',  color: 'bg-green-500',  textColor: 'text-green-400',  borderColor: 'border-green-500',  lightBg: 'bg-green-500/20' },
  d: { label: 'Yellow', color: 'bg-yellow-400', textColor: 'text-yellow-400', borderColor: 'border-yellow-400', lightBg: 'bg-yellow-400/20' },
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PieceState {
  name: string        // player id
  index: number       // 0-3
  squareIndex: number // 0-22
  homeId: number
  atHome: boolean
  atGoal: boolean
  onBoard: boolean
}

export type GamePhase = 'setup' | 'rolling' | 'choosing' | 'moving' | 'paused' | 'over'

// ─── Composable ──────────────────────────────────────────────────────────────

export const useLudoGame = () => {
  // ── Reactive state ──
  const gamePhase      = ref<GamePhase>('setup')
  const players        = ref<PlayerConfig[]>([])
  const currentPlayer  = ref<string>('a')
  const diceValue      = ref<number>(0)
  const diceRolling    = ref(false)
  const availableMoves = ref<LudoMove[]>([])
  const pieces         = ref<PieceState[]>([])
  const rankings       = ref<string[]>([])      // finished player ids in order
  const lastPlayer     = ref<string>('')
  const message        = ref<string>('')
  const moveLog        = ref<string[]>([])

  // Pause support
  const pausedPhase    = ref<GamePhase | null>(null)
  const savedPosition  = ref<string>('')

  // ── Derived ──
  const isPaused   = computed(() => gamePhase.value === 'paused')
  const isGameOver = computed(() => gamePhase.value === 'over')
  const currentPlayerConfig = computed(() => players.value.find(p => p.id === currentPlayer.value))
  const isBotTurn = computed(() => currentPlayerConfig.value?.isBot ?? false)

  // ── Piece tracking helpers ──

  /** Refresh all piece positions from the library */
  function refreshPieces() {
    const updated: PieceState[] = []
    for (const p of players.value) {
      for (let i = 0; i < 4; i++) {
        const sq = ludoSquare(p.id, i)
        if (sq) {
          updated.push({
            name: p.id,
            index: i,
            squareIndex: sq.index,
            homeId: sq.homeId,
            atHome: sq.type === 'home',
            atGoal: sq.type === 'goal',
            onBoard: sq.type !== 'home' && sq.type !== 'goal',
          })
        }
      }
    }
    pieces.value = updated
  }

  /** Count how many pieces a player has at goal */
  function goalCount(playerId: string): number {
    return pieces.value.filter(p => p.name === playerId && p.atGoal).length
  }

  /** Count how many pieces a player has at home */
  function homeCount(playerId: string): number {
    return pieces.value.filter(p => p.name === playerId && p.atHome).length
  }

  // ── Event wiring ──

  function wireEvents() {
    ludoOn('turn', (playerName: string) => {
      currentPlayer.value = playerName
    })

    ludoOn('move', (_piece: LudoPiece, _from: LudoSquare, _to: LudoSquare, type: MoveType) => {
      refreshPieces()
      const pLabel = PLAYER_PRESETS[_piece.name]?.label ?? _piece.name
      if (type === 'capture') {
        moveLog.value.push(`${pLabel} captured a piece!`)
      } else if (_to.type === 'goal') {
        moveLog.value.push(`${pLabel} piece reached the goal!`)
      } else if (type === 'move' && _from.type === 'home') {
        moveLog.value.push(`${pLabel} entered the board`)
      }
      // keep log manageable
      if (moveLog.value.length > 50) moveLog.value.splice(0, moveLog.value.length - 50)
    })

    ludoOn('finish', (_piece: LudoPiece) => {
      const pLabel = PLAYER_PRESETS[_piece.name]?.label ?? _piece.name
      rankings.value.push(_piece.name)
      moveLog.value.push(`🏆 ${pLabel} finished!`)
    })

    ludoOn('over', (finishedPlayers: string[], remaining: string) => {
      lastPlayer.value = remaining
      gamePhase.value = 'over'
      const winnerLabel = PLAYER_PRESETS[rankings.value[0] ?? '']?.label ?? '?'
      message.value = `${winnerLabel} wins the game!`
    })
  }

  // ── Game lifecycle ──

  function initGame(playerConfigs: PlayerConfig[]) {
    players.value = playerConfigs
    rankings.value = []
    lastPlayer.value = ''
    moveLog.value = []
    message.value = ''
    diceValue.value = 0
    availableMoves.value = []
    pausedPhase.value = null
    savedPosition.value = ''

    // Build position string: 4 slots separated by /
    // Slots with no player are empty
    const slotMap: Record<string, string> = {}
    for (const p of playerConfigs) slotMap[p.id] = 'abcd'

    const slots = ['a', 'b', 'c', 'd'].map(id => slotMap[id] ?? '').join('/')
    const captures = playerConfigs.map(() => 'a').join('')
    const posString = `${slots} a ${captures}`

    ludoInit({ position: posString, historySize: 200 })
    wireEvents()
    refreshPieces()

    currentPlayer.value = ludoTurn()
    gamePhase.value = 'rolling'
  }

  // ── Dice ──

  function rollDice(): number {
    const val = Math.floor(Math.random() * 6) + 1
    diceValue.value = val
    return val
  }

  /** Full roll → get moves → update phase */
  function performRoll() {
    if (gamePhase.value !== 'rolling') return

    diceRolling.value = true
    const val = rollDice()

    const result = ludoMoves(undefined, val)
    if (typeof result === 'string' || result.length === 0) {
      // No valid moves
      availableMoves.value = []
      message.value = `${currentPlayerConfig.value?.label ?? '?'} rolled ${val} — no moves available`
      // Turn auto-advances after we call a "skip move"
      // The library advances turn when move() isn't called — we just re-roll next player
      // But ludo.js does NOT auto-advance, so we need to force it with a dummy approach
      // Actually ludo.js doesn't advance automatically, we need to call a null move
      // The cleanest way: call moves() with next player to cycle, but that's not how it works
      // Instead, let's advance manually by re-initialising with current position but next turn
      advanceTurnManually()
      return
    }

    availableMoves.value = result
    if (result.length === 1) {
      // Only one move - auto select
      message.value = `${currentPlayerConfig.value?.label ?? '?'} rolled ${val}`
      setTimeout(() => selectMove(result[0]!), 400)
    } else {
      message.value = `${currentPlayerConfig.value?.label ?? '?'} rolled ${val} — choose a piece`
      gamePhase.value = 'choosing'
    }
  }

  /** Manually advance turn when no moves available */
  function advanceTurnManually() {
    // The library doesn't expose a "skip turn" function.
    // Workaround: save position, tweak turn letter, re-init
    const pos = ludoPosition()
    const parts = pos.split(' ')
    // parts[0] = piece positions, parts[1] = current turn, parts[2] = captures

    const activePlayers = players.value
      .filter(p => !rankings.value.includes(p.id))
      .map(p => p.id)

    const curIdx = activePlayers.indexOf(currentPlayer.value)
    const nextIdx = (curIdx + 1) % activePlayers.length
    const nextPlayerId = activePlayers[nextIdx]!

    parts[1] = nextPlayerId
    const newPos = parts.join(' ')

    ludoInit({ position: newPos, historySize: 200 })
    wireEvents()
    refreshPieces()
    currentPlayer.value = ludoTurn()
    gamePhase.value = 'rolling'
  }

  /** Select and execute a move */
  function selectMove(ludoMoveObj: LudoMove) {
    gamePhase.value = 'moving'
    const result = ludoMove(ludoMoveObj)
    if (result) {
      console.warn('[Ludo] move failed:', result)
    }

    refreshPieces()

    // If the move grants a repeat (rolled 6, capture, etc.)
    if (ludoMoveObj.isRepeat) {
      message.value = `${currentPlayerConfig.value?.label ?? '?'} gets another turn!`
      diceValue.value = 0
      availableMoves.value = []
      gamePhase.value = 'rolling'
    } else {
      // Turn was already advanced by the library via the 'turn' event
      diceValue.value = 0
      availableMoves.value = []
      if ((gamePhase.value as string) !== 'over') {
        gamePhase.value = 'rolling'
      }
    }
  }

  // ── Pause / Resume ──

  function pauseGame() {
    if (gamePhase.value === 'paused' || gamePhase.value === 'over' || gamePhase.value === 'setup') return
    pausedPhase.value = gamePhase.value
    savedPosition.value = ludoPosition()
    gamePhase.value = 'paused'
    message.value = 'Game paused'
  }

  function resumeGame() {
    if (gamePhase.value !== 'paused' || !pausedPhase.value) return

    // Reinitialise from saved position to keep library in sync
    if (savedPosition.value) {
      ludoInit({ position: savedPosition.value, historySize: 200 })
      wireEvents()
      refreshPieces()
      currentPlayer.value = ludoTurn()
    }

    gamePhase.value = pausedPhase.value
    pausedPhase.value = null
    savedPosition.value = ''
    message.value = 'Game resumed!'
  }

  // ── Bot Logic ──

  /** Pick the best move for a bot player (delegates to utils/ludoBot) */
  function botPickMove(movesArr: LudoMove[]): LudoMove {
    return pickBestMove(movesArr)
  }

  // ── Reset ──

  function resetGame() {
    gamePhase.value = 'setup'
    players.value = []
    currentPlayer.value = 'a'
    diceValue.value = 0
    diceRolling.value = false
    availableMoves.value = []
    pieces.value = []
    rankings.value = []
    lastPlayer.value = ''
    message.value = ''
    moveLog.value = []
    pausedPhase.value = null
    savedPosition.value = ''
  }

  return {
    // State
    gamePhase, players, currentPlayer, diceValue, diceRolling,
    availableMoves, pieces, rankings, lastPlayer, message, moveLog,

    // Computed
    isPaused, isGameOver, currentPlayerConfig, isBotTurn,

    // Methods
    initGame, rollDice, performRoll, selectMove,
    pauseGame, resumeGame, resetGame,
    refreshPieces, goalCount, homeCount,
    botPickMove, advanceTurnManually,

    // Constants
    PLAYER_PRESETS,
  }
}
