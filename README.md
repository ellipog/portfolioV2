# 🖥️ Windows XP Portfolio V2

A highly interactive, fully responsive Windows XP-themed portfolio website. It replicates the classic Luna XP desktop environment using Remix, Vite, Tailwind CSS, and `xp.css`.

---

## 🚀 Quick Start

### 1. Prerequisites
Ensure you have [Bun](https://bun.sh) installed.

### 2. Setup & Installation
```bash
# Clone the repository
git clone https://github.com/Ellipog/portfolioV2.git
cd portfolioV2

# Install dependencies
bun install
```

### 3. Running Locally
```bash
# Start the development server
bun run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🛠️ Build & Verification

Before committing, verify code compilation and production build integrity:

```bash
# Run TypeScript compilation checks
bun run typecheck

# Build the optimized production bundle
bun run build
```

---

## 📁 Key Directories & Apps

- **`components/Window.tsx`**: The core responsive window container featuring viewport boundary clamping and automatic centering for mobile screens.
- **`components/windows/`**: Integrated retro application widgets:
  - 🎨 **`Paint.tsx`**: HTML5 canvas drawer with custom brushes, erasers, and PNG download.
  - ⚡ **`Winamp.tsx`**: Skinnable audio player featuring dynamic equalizers, volume sliders, and classic system tracks.
  - 🌐 **`IEBrowser.tsx`**: Retro IE6 browser simulation loaded with project portfolios, search pages, and a glossy 3D Internet Explorer logo.
  - ⚙️ **`ControlPanel.tsx`**: Display customizer to change active desktop wallpaper dynamically and toggle system sounds.
  - 📊 **`TaskManager.tsx`**: Process manager showing live memory/CPU activity charts, with "End Process" actions and desktop easter eggs.

---
<div align="center">
Created with nostalgia by Elliot
</div>
