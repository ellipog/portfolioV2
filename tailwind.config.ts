import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Tahoma",
          "Verdana",
          "Trebuchet MS",
          "Geneva",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      colors: {
        luna: {
          blue: "#245edb",
          "title-top": "#0058ee",
          "title-bottom": "#1e3f9c",
          "green-top": "#5eac56",
          "green-bottom": "#2d7d28",
          select: "#2f71cd",
        },
        xp: {
          face: "#ece9d8",
          "face-dark": "#d4d0c8",
          "3dlight": "#fff",
          shadow: "#808080",
          darkshadow: "#404040",
        },
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-5deg)" },
          "75%": { transform: "rotate(5deg)" },
        },
      },
      animation: {
        shake: "shake 0.5s infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
