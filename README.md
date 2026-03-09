# Portfolio — Muhammad Ali Ghozi

Personal portfolio website built with **Nuxt 4**, featuring interactive mini-games, multi-language support, and modern glassmorphism UI.

> **Live site:** _Deploy your own_ &nbsp;|&nbsp; **Author:** Muhammad Ali Ghozi &nbsp;|&nbsp; **Email:** zenscilla@gmail.com &nbsp;|&nbsp; **GitHub:** [elzifire](https://github.com/elzifire)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Documentation](#documentation)
- [License](#license)

---

## Features

| Category | Highlights |
|---|---|
| **Portfolio** | Hero with typewriter effect, About with 3D tilt cards, Education timeline, Skill grid with category filters, Project gallery, Contact form |
| **Games** | ♟️ Chess (vs bot with 5 difficulty levels or multiplayer, timer modes), 🎲 Ludo (2-4 players, bot AI), 🐍 Snake (score tracking, mobile controls) |
| **i18n** | English 🇺🇸 & Bahasa Indonesia 🇮🇩 with browser detection and cookie persistence |
| **UX** | Dark/light mode, glassmorphism & 3D effects, responsive design, visitor counter, downloadable CV |
| **Quality** | TypeScript, unit tests (Vitest), Web Audio API sounds (no external files) |

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Nuxt | 4.1.3 |
| UI | Vue 3 | 3.5.28 |
| Styling | Tailwind CSS | 4.2.0 |
| Language | TypeScript | 5.9.3 |
| i18n | @nuxtjs/i18n | 10.2.3 |
| Chess engine | chess.js + vue3-chessboard | 1.4.0 / 1.3.3 |
| Ludo engine | @nanowiz/ludo.js | 1.0.0 |
| Icons | @heroicons/vue | 2.2.0 |
| Testing | Vitest + @vue/test-utils + happy-dom | 4.0.18 |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (or pnpm / yarn / bun)

### Installation

```bash
git clone https://github.com/elzifire/my-portofolio.git
cd my-portofolio
npm install
```

### Development

```bash
npm run dev          # Start dev server at http://localhost:3000
```

### Production

```bash
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Testing

```bash
npm run test         # Run all unit tests once
npm run test:watch   # Run tests in watch mode
```

---

## Project Structure

```
my-portofolio/
├── app/
│   ├── app.vue                  # Root layout (dark mode provider)
│   ├── assets/
│   │   ├── css/main.css         # Tailwind config, animations, theme
│   │   └── images/              # Profile photos
│   ├── components/
│   │   ├── Navbar.vue           # Fixed nav with glass effect
│   │   ├── HeroSection.vue      # Hero with typewriter & floating badges
│   │   ├── AboutSection.vue     # Bio, info cards, CV download
│   │   ├── EducationSection.vue # Timeline layout
│   │   ├── SkillsetSection.vue  # Filterable skill grid
│   │   ├── ProjectsSection.vue  # Project gallery with filters
│   │   ├── ContactSection.vue   # Contact form & social links
│   │   ├── FooterSection.vue    # Footer with quick links
│   │   ├── VisitorCounter.vue   # localStorage-based visit counter
│   │   ├── LanguageSwitcher.vue # EN/ID locale dropdown
│   │   └── ludo/               # Ludo game components
│   ├── composables/             # Reusable logic (games, effects)
│   ├── pages/
│   │   ├── index.vue            # Home — assembles all sections
│   │   ├── chess/index.vue      # Chess game page
│   │   ├── ludo/index.vue       # Ludo game page
│   │   └── snake/index.vue      # Snake game page
│   └── utils/                   # Game AI, board logic, types
├── i18n/locales/                # EN & ID translation files
├── public/                      # Static assets (CV PDF, robots.txt)
├── tests/                       # Unit tests
├── nuxt.config.ts               # Nuxt configuration
├── vitest.config.ts             # Test configuration
└── package.json
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run generate` | Generate static site |
| `npm run preview` | Preview production build |
| `npm run test` | Run unit tests once |
| `npm run test:watch` | Run tests in watch mode |

---

## Documentation

Detailed documentation is available in the `docs/` folder:

| Document | Description |
|---|---|
| [Technical Documentation](docs/TECHNICAL.md) | Architecture, composables, utilities, configuration |
| [Non-Technical Documentation](docs/NON-TECHNICAL.md) | Project overview, features, user guide |
| [System Architecture](docs/ARCHITECTURE.md) | Component diagram, data flow, system design |

---

## License

This project is private. © Muhammad Ali Ghozi
