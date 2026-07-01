/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
        crimson: ["Crimson Text", "serif"],
      },
      colors: {
        "wod-bg": "#0a0a0f",
        "wod-card": "#111118",
        "wod-surface": "#1a1a2e",
        "wod-text": "#e8e0d0",
        "wod-muted": "#8a8090",
        "wod-border": "#2a2a3a",
      },
    },
  },
  plugins: [],
};
