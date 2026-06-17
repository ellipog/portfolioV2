import { Dispatch, SetStateAction } from "react";
import { generateRandomPosition } from "utils/generateRandomPosition";

interface Window {
  title: string;
  icon: string;
  component?: React.ComponentType<{
    show: boolean;
    setActiveWindows: Dispatch<SetStateAction<Record<string, boolean>>>;
    windowOrder: string[];
    bringToFront: () => void;
  }>;
  defaultSize?: { width: number; height: number };
  defaultPosition?: { x: number; y: number };
  resizable?: boolean;
  isClippyExe?: boolean;
}

export enum LoadingState {
  BIOS = 0,
  Initial = 1,
  Boot1 = 2,
  Boot2 = 3,
  Black = 4,
  Desktop = 5,
}

const existingPositions: { x: number; y: number }[] = [];

export const windows: Window[] = [
  {
    title: "Skills",
    icon: "skills.png",
    defaultSize: { width: 300, height: 400 },
    defaultPosition: generateRandomPosition(300, 400, 1, existingPositions),
  },
  {
    title: "Projects",
    icon: "projects.png",
    defaultSize: { width: 600, height: 730 },
    defaultPosition: generateRandomPosition(600, 730, 2, existingPositions),
  },
  {
    title: "Work_Experience",
    icon: "work_experience.png",
    defaultSize: { width: 600, height: 400 },
    defaultPosition: generateRandomPosition(600, 400, 3, existingPositions),
  },
  {
    title: "Minesweeper",
    icon: "minesweeper.png",
    defaultSize: { width: 340, height: 400 },
    defaultPosition: generateRandomPosition(340, 400, 4, existingPositions),
    resizable: false,
  },
  {
    title: "Education",
    icon: "education.png",
    defaultSize: { width: 600, height: 400 },
    defaultPosition: generateRandomPosition(600, 400, 5, existingPositions),
  },
  {
    title: "Task_Manager",
    icon: "taskmanager.ico",
    defaultSize: { width: 420, height: 460 },
    defaultPosition: generateRandomPosition(420, 460, 6, existingPositions),
  },
  {
    title: "Paint",
    icon: "paint.svg",
    defaultSize: { width: 730, height: 580 },
    defaultPosition: generateRandomPosition(730, 580, 7, existingPositions),
    resizable: true,
  },
  // {
  //   title: "Winamp",
  //   icon: "projects.png",
  //   defaultSize: { width: 380, height: 460 },
  //   defaultPosition: generateRandomPosition(380, 460, 8, existingPositions),
  // },
  {
    title: "Internet_Explorer",
    icon: "ie.svg",
    defaultSize: { width: 900, height: 650 },
    defaultPosition: generateRandomPosition(900, 650, 9, existingPositions),
    resizable: true,
  },
  {
    title: "Control_Panel",
    icon: "control_panel.svg",
    defaultSize: { width: 620, height: 520 },
    defaultPosition: generateRandomPosition(620, 520, 7, existingPositions),
    resizable: false,
  },
  {
    title: "clippy.exe",
    icon: "clippy_exe.png",
    defaultSize: { width: 0, height: 0 },
    defaultPosition: generateRandomPosition(0, 0, 0, existingPositions),
    isClippyExe: true,
  },
];

windows.forEach((window) => {
  if (window.defaultPosition) {
    existingPositions.push(window.defaultPosition);
  }
});

export const personal = {
  title: "Personal",
  icon: "start_logo.png",
  name: "Elliot Strand Aaen",
  age: `Age: ${(() => {
    const birthday = new Date(2005, 8, 8);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    const day = today.getDate() - birthday.getDate();
    if (m < 0 || (m === 0 && day < 0)) {
      age--;
    }
    return age;
  })()}`,
  email: "elliot@aaenz.com",
  phone: "+47 46472369",
  profession: "Software Developer",
  linkedin: "https://www.linkedin.com/in/elliot-strand-aaen/",
};

export const skills = {
  title: "Skills",
  icon: "skills.png",
  skills: [
    {
      name: "JavaScript",
      icon: "javascript.png",
      link: "https://www.javascript.com/",
    },
    {
      name: "TypeScript",
      icon: "typescript.png",
      link: "https://www.typescriptlang.org/",
    },
    {
      name: "React",
      icon: "react.png",
      link: "https://react.dev/",
    },
    {
      name: "Next.js",
      icon: "nextjs.png",
      link: "https://nextjs.org/",
    },
    {
      name: "Java",
      icon: "java.png",
      link: "https://www.java.com/",
    },
    {
      name: "Kotlin",
      icon: "kotlin.png",
      link: "https://kotlinlang.org/",
    },
    {
      name: "Tailwind CSS",
      icon: "tailwind.png",
      link: "https://tailwindcss.com/",
    },
    {
      name: "Node.js",
      icon: "nodejs.png",
      link: "https://nodejs.org/",
    },
    {
      name: "Python",
      icon: "python.png",
      link: "https://www.python.org/",
    },
    {
      name: "SQL",
      icon: "sql.png",
      link: "https://www.postgresql.org/",
    },
    {
      name: "GIT",
      icon: "git.png",
      link: "https://git-scm.com/",
    },
    {
      name: "Lua",
      icon: "lua.png",
      link: "https://www.lua.org/",
    },
    {
      name: "C#",
      icon: "csharp.png",
      link: "https://docs.microsoft.com/en-us/dotnet/csharp/",
    },
    {
      name: "Verse",
      icon: "verse.png",
      link: "https://dev.epicgames.com/documentation/en-us/uefn/verse-language-reference",
    },
    {
      name: "GML",
      icon: "gml.png",
      link: "https://manual.gamemaker.io/monthly/en/GameMaker_Language/GML_Overview/GML_Overview.htm",
    },
    {
      name: "MongoDB",
      icon: "mongodb.png",
      link: "https://www.mongodb.com/",
    },
  ],
};

export const projects = {
  title: "Projects",
  icon: "projects.png",
  projects: [
    {
      name: "Portfolio V2",
      link: "https://github.com/Ellipog/portfolioV2",
      image: "github.png",
      year: "2026",
      description: `Upgraded portfolio. Made to look like Windows XP.`,
      languages: ["TypeScript", "Remix", "TailwindCSS", "Bun"],
    },
    {
      name: "Runen",
      link: "https://runen.no",
      image: "runen.ico",
      year: "2026",
      description: `A retro-styled collection of digital tools and artifacts, featuring a pixel art editor, ASCII generator, background remover, and other media utilities under a CRT scanline theme.`,
      languages: ["TypeScript", "NextJS", "TailwindCSS"],
    },
    {
      name: "Kana",
      link: "https://kana.aaenz.no",
      image: "kana.png",
      year: "2026",
      description: `An interactive, responsive Japanese language learning application designed for practicing Hiragana, Katakana, Kanji, and full sentences, featuring Spaced Repetition System (SRS) integration, JLPT-level filtering, and score tracking.`,
      languages: ["TypeScript", "NextJS", "TailwindCSS"],
    },
    {
      name: "aaenz.no",
      link: "https://aaenz.no",
      image: "aaenz.ico",
      year: "2026",
      description: `A minimalist portal and directory linking to all of Elliot's active web projects, github repositories, and social handles under a retro CRT terminal theme.`,
      languages: ["TypeScript", "NextJS", "TailwindCSS"],
    },
    {
      name: "Galdr",
      link: "https://galdr.aaenz.no",
      image: "galdr.ico",
      year: "2026",
      description: `A Tauri desktop app wrapping FFmpeg in a rune-themed, monochrome terminal GUI for converting and manipulating video, audio, and image files. Features batch conversion, quality presets, live command preview, and before/after comparison.`,
      languages: ["TypeScript", "React", "Rust", "Tauri", "Vite"],
    },
    {
      name: "Chat",
      link: "https://chat.aaenz.no",
      image: "chat_icon.png",
      year: "2025",
      description: `AI chatbot that remembers info about you, conversation history, and more. `,
      languages: [
        "TypeScript",
        "NextJS",
        "TailwindCSS",
        "MongoDB",
        "OpenAI",
        "BCrypt",
        "JWT",
      ],
    },
    {
      name: "My Recipes",
      link: "https://recipes.aaenz.no",
      image: "myrecipes.png",
      year: "2025",
      description: `A website utilizing AI to generate recipes based on ingredients, utilities, allergies, etc. `,
      languages: ["TypeScript", "NextJS", "TailwindCSS", "MongoDB", "OpenAI"],
    },
    {
      name: "My Awesome Cool Website",
      link: "https://myawesomecoolwebsite.aaenz.no",
      image: "myawesomecoolwebsite.png",
      year: "2025",
      description: `A fun website thats made to look like a early 2000's personal page. `,
      languages: ["TypeScript", "NextJS", "TailwindCSS", "Bun", "MongoDB"],
    },
    {
      name: "Wordle ∞",
      link: "https://wordle.aaenz.no",
      image: "wordle.jpeg",
      year: "2025",
      description: `A wordle clone, but without the daily limit. `,
      languages: ["TypeScript", "NextJS", "TailwindCSS", "Bun"],
    },
    {
      name: "ccGPT",
      link: "https://github.com/Ellipog/ccGPT",
      image: "github.png",
      year: "2025",
      description: `ComputerCraft AI chatbot, chat with gpt from inside Minecraft. `,
      languages: ["Lua", "ExpressJS", "OpenAI", "Node.js"],
    },
    {
      name: "Forsinka",
      link: "https://github.com/Ellipog/Forsinka",
      image: "github.png",
      year: "2023",
      description: `Forsinka is a web application that displays all 
      delayed arrivals to Ski Stasjon. 
      The app was made to as a school project. 
      And mainly to explore how API's work. And how to use ReactJS.`,
      languages: [
        "JavaScript",
        "React",
        "Node.js",
        "Firebase",
        "MongoDB",
        "enturAPI",
      ],
    },
    {
      name: "Post Creator",
      link: "https://github.com/Ellipog/post-creator",
      image: "github.png",
      year: "2024",
      description: `An interactive blog post builder. 
      Made for fun to learn how to use components better. `,
      languages: ["TypeScript", "NextJS", "TailwindCSS", "Bun"],
    },
    {
      name: "CC Create FarmInfo",
      link: "https://github.com/Ellipog/CC-Create-FarmInfo",
      image: "github.png",
      year: "2023",
      description: `A tool built for a Minecraft server. A computer inside the 
      game will collect data then send that data to a node.js server which then saves it to a database. 
      The frontend will then display said data to the user depending on what username they log in as. `,
      languages: ["JavaScript", "Lua", "Node.js"],
    },
    {
      name: "EX2023",
      link: "https://github.com/Ellipog/EX2023",
      image: "github.png",
      year: "2023",
      description: `2023 Exam project, 6/6. A mock web store. Custom made authentication system. Learning TypeScript, NextJS, encryption, databases, state management, etc.
      More in github README.md`,
      languages: [
        "TypeScript",
        "NextJS",
        "TailwindCSS",
        "Postman",
        "MongoDB",
        "BCrypt",
        "Redux",
      ],
    },
    {
      name: "dmToolbox",
      link: "https://github.com/Ellipog/dmToolbox",
      image: "github.png",
      year: "2024",
      description: `Toolbox for the board game Dungeons & Dragons. It has information about monsters. A battle manager with damage, effects, turns, etc. And more. `,
      languages: ["TypeScript", "NextJS", "dnd5eapi", "react-hot-toast"],
    },
  ],
};

export const workExperience = {
  title: "Work_Experience",
  icon: "work_experience.png",
  workExperience: [
    {
      name: "Skatteetaten",
      role: "Software Developer",
      year: "2023 AUG - 2025 AUG",
      description: `[Innovasjon / Folkeregisteret] Working on internal tools, Bikube, Innflyttingsportalen, Utflyttingsportalen, MinSide, OnlineOppslag, and more. 
      Working in a scrum team with 9 people.`,
      isMinor: false,
    },
    {
      name: "Intility",
      role: "Technical Support: Setup",
      year: "2023 FEB - 2023 MAR",
      description: `Setup computers, install software according to what the customer ordered. Shipping computers to customers. More. `,
      isMinor: false,
    },
    {
      name: "Greverud Sykehjem",
      role: "Caretaker",
      year: "2022 DEC",
      description: `Wash clothes, collect trash, and deliver ingredients to the kitchen.`,
      isMinor: true,
    },
    {
      name: "Intility",
      role: "Technical Support: Setup",
      year: "2022 OKT - 2022 NOV",
      description: `Setup computers, install software according to what the customer ordered. Shipping computers to customers. More. `,
      isMinor: false,
    },
    {
      name: "Greverud Sykehjem",
      role: "Caretaker",
      year: "2022 JUL - 2022 AUG",
      description: `Wash clothes, collect trash, and deliver ingredients to the kitchen.`,
      isMinor: true,
    },
  ],
};

export const education = {
  title: "Education",
  icon: "education.png",
  education: [
    {
      name: "Year 4 VGS",
      school: "Drømtorp VGS",
      year: "2025 AUG - 2026 JUN",
      description: `A fourth year of upper secondary education to gain general university admissions certification.`,
    },
    {
      name: "Apprenticeship",
      school: "Skatteetaten",
      year: "2023 AUG - 2025 AUG",
      description: `Software Developer`,
    },
    {
      name: "Year 2 VGS",
      school: "Drømtorp VGS",
      year: "2022 AUG - 2023 JUN",
      description: `Information Technology`,
    },
    {
      name: "Year 1 VGS",
      school: "Drømtorp VGS",
      year: "2021 AUG - 2022 JUN",
      description: `Information Technology & Media`,
    },
  ],
};
