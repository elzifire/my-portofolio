# System Architecture

> **Project:** Portfolio — Muhammad Ali Ghozi  
> **Framework:** Nuxt 4 (Vue 3) — SSR-capable, file-based routing  

---

## Table of Contents

- [High-Level Architecture](#high-level-architecture)
- [Component Architecture](#component-architecture)
- [Data Flow](#data-flow)
- [Routing & Page Structure](#routing--page-structure)
- [State Management](#state-management)
- [Game Architectures](#game-architectures)
- [Internationalization Flow](#internationalization-flow)
- [Build & Deploy Pipeline](#build--deploy-pipeline)
- [Design Decisions](#design-decisions)

---

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                          Browser                                 │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Home (/)   │  │ Chess (/chess)│ │ Ludo (/ludo) │ ...        │
│  │             │  │             │  │             │              │
│  │  Navbar     │  │  Setup UI   │  │  Setup UI   │              │
│  │  Hero       │  │  Board      │  │  Board (SVG)│              │
│  │  About      │  │  Timer      │  │  Sidebar    │              │
│  │  Education  │  │  History    │  │  Move Log   │              │
│  │  Skills     │  │  Game Over  │  │  Game Over  │              │
│  │  Projects   │  │             │  │             │              │
│  │  Contact    │  └──────┬──────┘  └──────┬──────┘              │
│  │  Footer     │         │                │                      │
│  └──────┬──────┘         │                │                      │
│         │                │                │                      │
│  ┌──────┴────────────────┴────────────────┴───────────────┐      │
│  │                    Composables Layer                     │      │
│  │  useChessGame  useChessTimer  useChessSound             │      │
│  │  useLudoGame   useLudoSound   useTilt3D  useTypewriter  │      │
│  └──────────────────────┬──────────────────────────────────┘      │
│                         │                                        │
│  ┌──────────────────────┴──────────────────────────────────┐      │
│  │                    Utilities Layer                        │      │
│  │  chessBot.ts  ludoBot.ts  ludoBoard.ts  ludoTypes.ts     │      │
│  └──────────────────────┬──────────────────────────────────┘      │
│                         │                                        │
│  ┌──────────────────────┴──────────────────────────────────┐      │
│  │               External Libraries                          │      │
│  │  chess.js   vue3-chessboard   @nanowiz/ludo.js           │      │
│  └──────────────────────────────────────────────────────────┘      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │  Browser APIs: localStorage, Web Audio API, Cookies       │      │
│  └──────────────────────────────────────────────────────────┘      │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  Nuxt 4 Engine  │  @nuxtjs/i18n  │  Tailwind CSS  │  Vite      │
└──────────────────────────────────────────────────────────────────┘
```

**Architecture Style:** Client-side SPA (Single Page Application) with Nuxt's file-based routing. No backend API — all data is stored in the browser (localStorage / cookies).

---

## Component Architecture

### Component Hierarchy

```
app.vue (Dark Mode Provider)
  └── <NuxtPage />
        ├── pages/index.vue (Home)
        │     ├── Navbar
        │     │     └── LanguageSwitcher
        │     ├── HeroSection
        │     ├── AboutSection
        │     ├── EducationSection
        │     ├── SkillsetSection
        │     ├── ProjectsSection
        │     ├── VisitorCounter
        │     ├── ContactSection
        │     └── FooterSection
        │
        ├── pages/chess/index.vue
        │     └── (inline: setup, board, timer, history, game-over)
        │
        ├── pages/ludo/index.vue
        │     ├── LudoSetup
        │     ├── LudoBoard
        │     ├── LudoSidebar
        │     │     └── LudoDice
        │     ├── LudoMoveLog
        │     └── LudoGameOver
        │
        └── pages/snake/index.vue
              └── (inline: grid, controls, score, game-over)
```

### Communication Patterns

```
┌─── provide/inject ──────────────────────┐
│                                          │
│  app.vue                                 │
│    provides: isDark, toggleDarkMode      │
│    ↓ injected by all child components    │
│                                          │
└──────────────────────────────────────────┘

┌─── props / emits ───────────────────────┐
│                                          │
│  ludo/index.vue                          │
│    ← LudoSetup  emits: @start           │
│    → LudoBoard  props: pieces, ...       │
│    → LudoSidebar props: player, dice     │
│    ← LudoSidebar emits: @roll, @pause   │
│    → LudoGameOver props: rankings, stats │
│                                          │
└──────────────────────────────────────────┘

┌─── composables (shared reactive state) ─┐
│                                          │
│  Page imports composable                 │
│    → composable returns refs + functions │
│    → Page passes to child components     │
│    → Components read/modify shared state │
│                                          │
└──────────────────────────────────────────┘
```

---

## Data Flow

### Dark Mode Flow

```
System Preference ──┐
                    ├──→ app.vue onMounted() ──→ isDark ref
localStorage ───────┘         │
                              ├── provide('isDark')
                              ├── provide('toggleDarkMode')
                              │
                              ↓
                    All components inject isDark
                              │
                    Navbar toggleDarkMode()
                              │
                              ↓
                    localStorage.setItem('darkMode')
                    isDark.value = !isDark.value
                    <div :class="{ dark: isDark }">
```

### i18n Flow

```
Browser Language ──→ @nuxtjs/i18n detects
                           │
                    Cookie check (i18n_redirected)
                           │
                    Set active locale (en | id)
                           │
                    Load locale JSON file
                           │
                    $t('key') resolves in templates
                           │
                    LanguageSwitcher → setLocale()
                           │
                    Cookie updated → locale reloaded
```

### Chess Game Flow

```
                    ┌─────────────────┐
                    │   Setup Screen   │
                    │ Mode, Difficulty, │
                    │ Color, Timer      │
                    └────────┬─────────┘
                             │ Start Game
                             ↓
                    ┌─────────────────┐
                    │   Game Loop      │
                    │                  │
                    │  Player Move ────┼──→ chess.js validates
                    │       │         │      │
                    │       ↓         │      ↓
                    │  Update board   │  Sound effect
                    │       │         │
                    │  Check status ──┼──→ Checkmate? Stalemate?
                    │       │         │      Draw? Time out?
                    │       ↓         │
                    │  Switch turn    │
                    │       │         │
                    │  If bot turn ───┼──→ chessBot.getBestMove()
                    │       │         │      (minimax + α-β pruning)
                    │       ↓         │
                    │  Timer ticks ───┼──→ useChessTimer countdown
                    │                  │
                    └────────┬─────────┘
                             │ Game ends
                             ↓
                    ┌─────────────────┐
                    │   Game Over      │
                    │ Save to history  │──→ localStorage
                    │ Show results     │
                    └──────────────────┘
```

### Ludo Game Flow

```
                    ┌─────────────────┐
                    │   LudoSetup      │
                    │ 2-4 players,     │
                    │ human/bot config  │
                    └────────┬─────────┘
                             │ initGame()
                             ↓
              ┌──────────────────────────────┐
              │       Game Loop (phases)      │
              │                               │
              │  'rolling' ──→ performRoll()  │
              │       │         dice value     │
              │       ↓                       │
              │  'choosing' ──→ Available     │
              │       │         moves shown    │
              │       ↓                       │
              │  'moving' ───→ selectMove()   │
              │       │         animate piece  │
              │       │         check capture  │
              │       │         check goal     │
              │       ↓                       │
              │  Next player / extra turn     │
              │       │                       │
              │  If bot ─────→ ludoBot        │
              │                pickBestMove() │
              └──────────┬────────────────────┘
                         │ All pieces at goal
                         ↓
              ┌──────────────────────┐
              │   LudoGameOver       │
              │   Rankings, Stats    │
              └──────────────────────┘
```

### Snake Game Flow

```
              ┌──────────────────────┐
              │   Start / Restart     │
              │   Snake at center     │
              │   Random food placed  │
              └────────┬──────────────┘
                       │
              ┌────────┴──────────────┐
              │   Game Loop (interval) │
              │                        │
              │   Read direction ──────┼── Keyboard / Touch
              │        │               │
              │   Move head             │
              │        │               │
              │   Collision? ──────────┼── Wall or self → Game Over
              │        │               │
              │   Food? ───────────────┼── Yes → Grow + Score + New food
              │        │               │         High score → localStorage
              │   No → Remove tail     │
              │        │               │
              │   Render grid          │
              └────────┴──────────────┘
```

---

## Routing & Page Structure

```
Route              Page File                    Layout
──────────────────────────────────────────────────────────
/                  pages/index.vue              app.vue (NuxtPage)
/chess             pages/chess/index.vue        app.vue (NuxtPage)
/ludo              pages/ludo/index.vue         app.vue (NuxtPage)
/snake             pages/snake/index.vue        app.vue (NuxtPage)
```

**In-page anchors** (smooth scroll on the home page):
```
/#home       → HeroSection
/#about      → AboutSection
/#skills     → SkillsetSection
/#projects   → ProjectsSection
/#contact    → ContactSection
```

**Navigation flow:**
```
Home ←──→ Chess    (back button returns to /)
Home ←──→ Ludo     (back button returns to /)
Home ←──→ Snake    (back button returns to /)
```

---

## State Management

This project does **not** use Vuex or Pinia. State is managed through:

### 1. Composables (Shared Reactive State)

Each game has dedicated composables returning `ref()` and `reactive()` objects. The page component imports the composable and passes state to child components via props.

```
Page (owner)
  │
  ├── const { state, actions } = useGameComposable()
  │
  ├── <ChildA :data="state.x" />
  └── <ChildB @event="actions.doSomething" />
```

### 2. Provide / Inject (Global Context)

Only used for dark mode:
```
app.vue → provide('isDark', isDark)
        → provide('toggleDarkMode', toggleDarkMode)

Any component → inject('isDark')
```

### 3. localStorage (Persistence)

| Key | Component | Data |
|---|---|---|
| `darkMode` | app.vue | `boolean` — dark mode preference |
| `chess_saved_games` | useChessGame | `Array` — game history |
| `snakeHighScore` | snake/index.vue | `number` — best score |
| `visitor_count` | VisitorCounter | `number` — total visits |
| `i18n_redirected` | @nuxtjs/i18n (cookie) | `string` — locale code |

### 4. Props / Emits (Parent-Child)

Standard Vue pattern for component communication, heavily used in Ludo game components.

---

## Game Architectures

### Chess Architecture

```
┌─────────────────────────────────────────────────┐
│              chess/index.vue (Page)               │
│                                                   │
│  ┌─────────────┐  ┌──────────────┐               │
│  │ useChessGame │  │ useChessTimer │               │
│  │  game state  │  │  countdown   │               │
│  └──────┬──────┘  └──────┬───────┘               │
│         │                │                        │
│  ┌──────┴────────────────┴───────────────┐        │
│  │              Game Board                │        │
│  │     vue3-chessboard component          │        │
│  │            ↕                           │        │
│  │     chess.js (validation, FEN, PGN)    │        │
│  └──────────────┬────────────────────────┘        │
│                 │                                  │
│  ┌──────────────┴────────────────────────┐        │
│  │     chessBot.ts (when mode = 'bot')    │        │
│  │     Minimax + Alpha-Beta Pruning       │        │
│  │     Piece-square evaluation tables     │        │
│  └───────────────────────────────────────┘        │
│                                                   │
│  ┌───────────────────────────────────────┐        │
│  │     useChessSound (Web Audio API)      │        │
│  │     Procedural sound synthesis         │        │
│  └───────────────────────────────────────┘        │
└─────────────────────────────────────────────────┘
```

### Ludo Architecture

```
┌─────────────────────────────────────────────────┐
│              ludo/index.vue (Page)                │
│                                                   │
│  ┌──────────────────────────────────────────┐     │
│  │              useLudoGame                   │     │
│  │  Wraps @nanowiz/ludo.js in Vue reactivity │     │
│  │  Manages phases, turns, dice, pieces       │     │
│  └──────────────┬───────────────────────────┘     │
│                 │                                  │
│  ┌──────────────┴──────────────┐                   │
│  │  ludoBoard.ts               │                   │
│  │  SVG coordinate mapping     │                   │
│  │  600×600 viewBox layout     │                   │
│  │  Piece position calculation │                   │
│  └─────────────────────────────┘                   │
│                                                   │
│  ┌─────────────────────────────┐                   │
│  │  ludoBot.ts                 │                   │
│  │  Heuristic scoring AI       │                   │
│  │  Weighted move evaluation   │                   │
│  └─────────────────────────────┘                   │
│                                                   │
│  ┌─────────────────────────────┐                   │
│  │  useLudoSound               │                   │
│  │  Web Audio API effects      │                   │
│  └─────────────────────────────┘                   │
└─────────────────────────────────────────────────┘
```

### Snake Architecture

```
┌─────────────────────────────────────────────────┐
│            snake/index.vue (Self-contained)       │
│                                                   │
│  State: grid[][], snake[], food, direction, score │
│                                                   │
│  Game loop: setInterval(tick, speed)              │
│  Input: keydown listener + touch button emits     │
│  Render: 20×20 grid with reactive CSS classes     │
│  Persistence: localStorage for high score         │
│                                                   │
│  No external library — pure Vue 3 logic           │
└─────────────────────────────────────────────────┘
```

---

## Internationalization Flow

```
┌──────────────────────────────────────────────────┐
│                  @nuxtjs/i18n                     │
│                                                   │
│  nuxt.config.ts                                   │
│    locales: [{ code: 'en' }, { code: 'id' }]     │
│    defaultLocale: 'en'                            │
│    strategy: 'no_prefix'                          │
│    detectBrowserLanguage: { useCookie: true }     │
│                                                   │
│  i18n/locales/                                    │
│    ├── en.json  (English translations)            │
│    └── id.json  (Indonesian translations)         │
│                                                   │
│  In templates:                                    │
│    {{ $t('section.key') }}                        │
│                                                   │
│  LanguageSwitcher.vue:                            │
│    setLocale('en') / setLocale('id')              │
│    → Updates cookie → Reloads translations        │
│                                                   │
└──────────────────────────────────────────────────┘
```

**Translation key namespace:**
```
nav.*        — Navigation items
hero.*       — Hero section
about.*      — About section
education.*  — Education section
skills.*     — Skill categories & labels
projects.*   — Project section
contact.*    — Contact form & info
footer.*     — Footer
visitor.*    — Visitor counter
```

---

## Build & Deploy Pipeline

```
Source Code (TypeScript + Vue SFC + Tailwind)
        │
        ↓
   Nuxt Build (Vite)
        │
        ├── Vue SFC compilation
        ├── TypeScript transpilation
        ├── Tailwind CSS purge & compile
        ├── Asset optimization
        └── Route generation
        │
        ↓
   Output: .output/ (SSR) or .output/public/ (Static)
        │
        ↓
   Deploy to: Vercel / Netlify / any Node host
```

**Build Commands:**
```bash
npm run build      # SSR production build
npm run generate   # Static site generation (pre-rendered HTML)
```

---

## Design Decisions

### Why Nuxt 4 (not plain Vue or Next.js)?
- File-based routing reduces boilerplate
- Built-in SSR/SSG support for SEO
- Rich module ecosystem (@nuxtjs/i18n)
- Auto-imports for composables and components
- Native TypeScript support

### Why Tailwind CSS v4?
- Utility-first approach for rapid UI development
- CSS custom properties for theming (primary/accent scales)
- Built-in dark mode variant
- Minimal CSS output after purge
- `@tailwindcss/vite` for fast development builds

### Why Web Audio API instead of audio files?
- Zero external assets to load
- Precise control over pitch, duration, and waveform
- No licensing concerns
- Smaller bundle size
- Works reliably across browsers

### Why localStorage instead of a backend database?
- Portfolio is a static/client-only site — no server needed
- Simplifies deployment (no database setup)
- Game history and preferences are personal, per-device
- No user accounts required

### Why composables instead of Pinia/Vuex?
- Games have isolated, page-scoped state — no global store needed
- Composables provide clean encapsulation with simpler API
- Less boilerplate than Pinia for this use case
- Easy to test independently

### Why SVG for the Ludo board?
- Scalable to any screen size without quality loss
- Precise geometric positioning for cells and pieces
- Animatable with CSS transitions
- Lightweight compared to Canvas for this complexity level

### Why Minimax for Chess AI?
- Well-proven algorithm for two-player perfect-information games
- Alpha-beta pruning provides efficient search at depth 5
- Piece-square tables give positionally aware evaluation
- Randomness parameter provides variable difficulty without separate algorithms
