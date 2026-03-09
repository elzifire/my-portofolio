# Non-Technical Documentation

> **Project:** Portfolio Website — Muhammad Ali Ghozi  
> **Type:** Personal Portfolio & Interactive Showcase  
> **Status:** Active Development

---

## Table of Contents

- [Project Overview](#project-overview)
- [Target Audience](#target-audience)
- [Features Overview](#features-overview)
- [User Guide](#user-guide)
- [Supported Languages](#supported-languages)
- [Browser Support](#browser-support)
- [FAQ](#faq)

---

## Project Overview

This is a personal portfolio website for **Muhammad Ali Ghozi**, a Junior Developer based in Indonesia. The website serves as a digital resume and skill showcase, featuring:

- Professional profile and biography
- Education background
- Technical skill set with proficiency levels
- Project portfolio with live/source links
- Interactive mini-games (Chess, Ludo, Snake)
- Downloadable CV in PDF format
- Contact form
- Multi-language support (English & Indonesian)

The site is designed to impress recruiters and HR professionals with modern design, smooth animations, and interactive elements that demonstrate technical ability.

---

## Target Audience

| Audience | What They'll Find |
|---|---|
| **Recruiters / HRD** | Professional profile, CV download, project portfolio, contact form |
| **Developers** | Source code quality, game implementations, technical architecture |
| **General Visitors** | Interactive games, clean UI, bilingual content |

---

## Features Overview

### 1. Portfolio Sections

#### Hero Section
The landing area features a dynamic typewriter animation that cycles through job titles ("Junior Developer", "Web Developer", etc.), floating animated badges, and call-to-action buttons.

#### About Me
Displays personal information, experience highlights (1+ years learning, 5+ projects), and a **Download CV** button that opens the CV as a PDF in a new tab.

#### Education
A visual timeline showing educational background at Universitas Ibn Khaldun Bogor (2021–2025), Bachelor of Computer Science.

#### Skills
An interactive filterable grid displaying 20+ technologies organized by category:
- **Frontend:** Vue.js, React.js, HTML/CSS, JavaScript, TypeScript, Nuxt.js, Tailwind CSS
- **Backend:** Node.js, Laravel, PHP, CodeIgniter, Go
- **Database:** MySQL, PostgreSQL
- **DevOps & OS:** Docker, Linux, Windows
- **Tools:** Git, GitHub, VS Code, Postman, Office

Each skill shows a proficiency level bar with animated fill.

#### Projects
A gallery of 6 featured projects with filtering (All, Web, Fullstack, Frontend). Each project card shows:
- Project name and description
- Technology stack used
- Status (Completed / In Progress)
- Links to live site and GitHub repository

**Featured Projects:**
1. Masjid Ibn Khaldun Bogor — Full Stack (Laravel, Vue.js, MySQL)
2. Portfolio Website — Frontend (Nuxt.js, Vue.js, Tailwind)
3. Akses Kelola Perhutanan Sosial — Full Stack (PHP, PostgreSQL, Docker)
4. Complain Management System — Full Stack (Node.js, PHP, Nuxt.js)
5. Landing Page Company — Frontend (HTML, CSS, Tailwind)
6. Setoran Hafalan Al-Qur'an — Full Stack (Laravel, Nuxt.js, MySQL)

#### Contact
A contact form with fields for Name, Email, Subject, and Message. Also displays direct contact information (email, location, availability status) and social media links.

---

### 2. Interactive Games

Three fully playable browser games that demonstrate programming skill:

#### ♟️ Chess
- **Modes:** Play against a friend (multiplayer) or the computer (5 difficulty levels)
- **Timer options:** None, Bullet (1 min), Blitz (3 min), Rapid (10 min), Classical (30 min)
- **Features:** Sound effects, move history, game saving, color selection
- **Access:** Navigation → Games → Chess

#### 🎲 Ludo
- **Players:** 2–4 players, mix of human and computer players
- **Features:** SVG game board, dice rolling, piece movement, capture mechanics, rankings
- **Controls:** Click on highlighted pieces to move, roll dice with button
- **Access:** Navigation → Games → Ludo (if listed)

#### 🐍 Snake
- **Controls:** Arrow keys or WASD (keyboard), directional buttons (mobile/touch)
- **Features:** Score tracking, high score persistence, responsive grid
- **Access:** Navigation → Games → Snake

---

### 3. Multi-Language Support

The website supports two languages:
- 🇺🇸 **English** (default)
- 🇮🇩 **Bahasa Indonesia**

**How to switch:** Click the language switcher icon in the navigation bar and select your preferred language. Your choice is saved in a cookie so it persists across visits.

The browser's language preference is also detected automatically on the first visit.

---

### 4. Dark / Light Mode

Toggle between dark and light themes using the moon/sun icon in the navigation bar. The preference is saved and persists across sessions. If no preference is saved, the site follows your system settings.

---

### 5. Visitor Counter

A live visitor counter displayed on the home page. It tracks total page visits using browser storage.

---

### 6. CV Download

Click the **"Download CV"** button in the About section to open the PDF curriculum vitae in a new browser tab.

---

## User Guide

### Navigating the Site

1. **Desktop:** Use the top navigation bar to jump between sections. Hover over "Games" for the dropdown menu.
2. **Mobile:** Tap the hamburger menu (☰) to open navigation. Tap section names to scroll. Expand "Games" to see game links.

### Playing Chess

1. Go to **Games → Chess**
2. Choose game mode: **Multiplayer** or **vs Computer**
3. If playing vs Computer, select difficulty (Beginner → Expert) and your color
4. Optionally select a timer mode
5. Click **Start Game**
6. Make moves by clicking/dragging pieces on the board
7. The game ends on checkmate, stalemate, or time-out

### Playing Ludo

1. Go to **Games → Ludo**
2. Configure players (2–4): set each as Human, Bot, or Disabled
3. Toggle sound on/off
4. Click **Start Game**
5. Click **Roll Dice** on your turn
6. Click a highlighted piece to move it
7. First player to get all 4 pieces to the goal wins

### Playing Snake

1. Go to **Games → Snake**
2. Use **Arrow keys** or **WASD** to control direction
3. On mobile, use the on-screen directional buttons
4. Eat the 🍎 to grow and score points
5. Avoid hitting walls or your own tail
6. Press **Restart** after game over

---

## Supported Languages

| Language | Code | Coverage |
|---|---|---|
| English | `en` | 100% — All UI elements |
| Bahasa Indonesia | `id` | 100% — All UI elements |

---

## Browser Support

The website uses modern web technologies and is tested on:

| Browser | Support |
|---|---|
| Chrome 90+ | ✅ Full |
| Firefox 90+ | ✅ Full |
| Safari 15+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Mobile browsers | ✅ Responsive design |

**Requirements:** JavaScript must be enabled. Web Audio API support required for game sounds.

---

## FAQ

**Q: How do I download the CV?**  
A: Scroll to the "About" section and click the "Download CV" button. The PDF will open in a new tab.

**Q: Can I play games on mobile?**  
A: Yes. Snake has touch-friendly directional buttons. Chess and Ludo boards are responsive. For the best chess experience, a larger screen is recommended.

**Q: How do I change the language?**  
A: Click the language switcher (globe icon with flag) in the top navigation bar and select English or Bahasa Indonesia.

**Q: Is my game progress saved?**  
A: Chess game history is saved in your browser's local storage. Snake high scores are also persisted. Ludo games are not saved between sessions.

**Q: How do I contact the developer?**  
A: Use the contact form in the "Contact" section, or email directly at zenscilla@gmail.com.
