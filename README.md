# Windows XP Portfolio V2

A highly interactive, fully responsive Windows XP-themed portfolio website by **Elliot Strand Aaen**. It replicates the classic Luna XP desktop environment in the browser using Remix, Vite, Tailwind CSS, and `xp.css`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Remix](https://remix.run/) v2.15 |
| Runtime | [Bun](https://bun.sh) |
| Language | TypeScript 5.7 |
| UI | React 18 + Tailwind CSS 3.4 + [xp.css](https://unpkg.com/xp.css) |
| Animation | Framer Motion 11 |
| Icons | Lucide React |
| Drag-and-Drop | react-draggable |
| Bundler | Vite 5.4 |

---

## Quick Start

### Prerequisites
- [Bun](https://bun.sh) installed

### Setup & Installation
```bash
git clone https://github.com/Ellipog/portfolioV2.git
cd portfolioV2
bun install
```

### Running Locally
```bash
bun run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## Build & Verification

```bash
bun run typecheck   # TypeScript compilation check
bun run build       # Production build
bun run start       # Serve production build
bun run lint        # ESLint
```

---

## Features

### Boot Sequence
A state machine simulates an authentic PC boot: fake BIOS screen, animated boot GIF, black screen, and classic XP startup/logon sounds before the desktop appears.

### Desktop Environment
- **Draggable Windows** — Resizable, minimizable, closable windows with viewport boundary clamping and z-index layering.
- **Taskbar** — Green Start button, icon tray for all open windows, system clock (Norwegian locale).
- **Start Menu** — User profile card with name, photo, and profession; app launchers; contact info with clipboard copy; LinkedIn link.
- **Desktop Icons** — Draggable grid of icons with rename support and custom folder creation.
- **Right-Click Context Menu** — Full XP-style menu: Open, Delete, Rename, New Folder, Refresh, etc.
- **Blue Selection Rectangle** — Click-and-drag desktop selection.

### Retro Applications (10 Windows)

| App | Description |
|---|---|
| **Skills** | 16 technologies with icons and external links (JavaScript, TypeScript, React, Java, Kotlin, Python, C#, Lua, etc.) |
| **Projects** | 14 project cards with descriptions, year, tech tags, and links |
| **Work Experience** | Timeline of 5 jobs with year ranges and descriptions |
| **Education** | Timeline of educational stages including apprenticeship at Skatteetaten |
| **Minesweeper** | Fully playable 9x9 Minesweeper with 10 mines, timer, flag system, and first-click safe zone |
| **Paint** | Full MS Paint clone — 16 tools (pencil, brush, eraser, fill bucket, eyedropper, spray can, shapes), 28-color palette, zoom (1x–8x), undo (50-step history), save as PNG |
| **IE Browser** | IE6 browser simulator with MSN portal home page, project/work pages, simulated Google search, guestbook, banner ads, visitor counter |
| **Winamp** | Skinnable audio player with equalizer/oscilloscope visualization, volume/balance sliders, playlist of XP system sounds |
| **Control Panel** | Display settings (5 wallpapers) with live monitor preview, sound tab with volume and toggle controls, About tab |
| **Task Manager** | Applications/Processes/Performance tabs, live CPU/memory canvas charts, "End Process" with real effects |

### Clippy Assistant
An interactive Clippy that appears with contextual tips and action buttons. Tracks which windows the user has opened and offers relevant suggestions.

### Easter Eggs & Interactions
- **Delete `clippy.exe`** (from Task Manager) → Angry Clippy → 120 error popups → Blue Screen of Death → Auto-restart
- **Kill `explorer.exe`** → Desktop disappears → Command prompt terminal with `help`, `explorer`, `dir`, `taskmgr`, `clippy`, `cls`, `ver`, `exit` commands
- **Sound system** — System-wide volume, mute toggles for alerts and startup sounds, classic XP `.wav` sound effects

### Mobile
Comprehensive mobile detection warns users the experience is best on desktop, with an override option. Windows auto-center and scale on small screens.

---

## Project Structure

```
portfolioV2/
├── app/
│   ├── root.tsx              # Root layout (xp.css, custom font, global scripts)
│   ├── tailwind.css           # Tailwind directives + custom styles
│   └── routes/
│       └── _index.tsx         # Main route — entire XP desktop state machine
├── components/
│   ├── Window.tsx             # Draggable window container
│   ├── Navbar.tsx             # XP taskbar with clock + Start button
│   ├── StartMenu.tsx          # Start menu popup
│   ├── DesktopIcons.tsx       # Desktop icon grid with drag + rename
│   ├── RightClick.tsx         # Context menu system
│   ├── Clippy.tsx             # Animated Clippy assistant
│   ├── BIOS.tsx               # Fake BIOS boot screen
│   ├── BlueScreen.tsx         # BSOD crash screen
│   ├── ErrorPopup.tsx         # Draggable error dialogs
│   ├── BlueMarker.tsx         # Desktop selection rectangle
│   ├── MobileExample.tsx      # Mobile detection component
│   └── windows/
│       ├── Skills.tsx
│       ├── Projects.tsx
│       ├── WorkExperience.tsx
│       ├── Education.tsx
│       ├── Minesweeper.tsx
│       ├── Paint.tsx
│       ├── IEBrowser.tsx
│       ├── Winamp.tsx
│       ├── ControlPanel.tsx
│       └── TaskManager.tsx
├── data/
│   ├── windows.ts             # Personal info, skills, projects, work/education data
│   └── clippyMessages.ts      # Clippy dialogue trees and error messages
├── utils/
│   ├── generateRandomPosition.ts
│   ├── isMobile.ts
│   └── playSound.ts
└── public/
    ├── audio/                 # XP system sound effects (WAV)
    ├── skills/                # Tech skill icons
    ├── font/                  # PixeloidMono.ttf
    └── *.png, *.jpg, *.ico    # Wallpapers, icons, avatars
```

---

<div align="center">
Created with nostalgia by Elliot
</div>