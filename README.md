# Windows XP Portfolio Website

A nostalgic Windows XP-themed portfolio website built with React, Remix, and TypeScript. Experience the classic Windows XP interface with modern web technologies.

![Desktop Preview](public/desktop_bg.png)

## 🖥️ Features

- **Authentic Windows XP Experience**

  - Classic boot sequence with BIOS screen
  - Windows XP-style desktop interface
  - Interactive start menu and taskbar
  - Draggable and resizable windows
  - Right-click context menu
  - System sounds and effects

- **Interactive Elements**

  - Clippy assistant with dynamic messages
  - Minesweeper game
  - Desktop icons
  - Error popups
  - Blue screen of death (BSOD)
  - Window management system

- **Portfolio Sections**
  - Skills
  - Projects
  - Work Experience
  - Education
  - Contact Information

## 🛠️ Tech Stack

- React
- Remix
- TypeScript
- Tailwind CSS
- Bun

## 🚀 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/portfolioV2.git
cd portfolioV2
```

2. Install dependencies:

```bash
bun install
```

3. Run the development server:

```bash
bun run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🎮 Usage

- Click on desktop icons to open corresponding windows
- Use the Start Menu to navigate between different sections
- Right-click anywhere for the context menu
- Interact with Clippy for assistance (don't try to delete him!)
- Play Minesweeper for fun
- Drag windows to rearrange them
- Minimize, maximize, or close windows using the window controls

## 📁 Project Structure

```
portfolioV2/
├── app/
│   ├── routes/         # Route components
│   └── tailwind.css    # Tailwind styles
├── components/         # React components
│   ├── windows/        # Window components
│   ├── StartMenu.tsx   # Start menu component
│   ├── Navbar.tsx     # Taskbar component
│   └── ...
├── data/              # Static data and configurations
├── public/            # Static assets
│   ├── audio/         # System sounds
│   ├── skills/        # Skill icons
│   └── ...
└── utils/             # Utility functions
```

## 🎨 Customization

The website can be customized by modifying:

- `data/windows.ts` - Window configurations and content
- `data/clippyMessages.ts` - Clippy's messages
- `public/` - Images and audio files
- `tailwind.css` - Styling customizations

---

<div align="center">
by Elliot
</div>
