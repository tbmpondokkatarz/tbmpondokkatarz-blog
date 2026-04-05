import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js}"],
  theme: {
    extend: {
      colors: {
        teal: "#1a5f6a",
        "teal-dark": "#0d3d46",
        gold: "#f0b429",
        "gold-light": "#ffd76b",
        cream: "#faf6ef",
        ink: "#1a1a18",
        muted: "#6b6b60",
      },
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        body: ['"DM Sans"', "sans-serif"],
        mono: ['"Space Mono"', "monospace"],
      },
    },
  },
  plugins: [typography],
};
