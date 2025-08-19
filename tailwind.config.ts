import type { Config } from "tailwindcss"
import animatePlugin from "tailwindcss-animate"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Cinzel Decorative", "serif"],
        subheading: ["Times New Roman", "serif"],
        body: ["Playfair Display", "serif"],
      },
      colors: {
        lavender: '#E6E6FA',
        blueberry: '#9370DB',
        strawberry: '#FF6F91',
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 10px #FF6F91" },
          "50%": { opacity: "0.8", boxShadow: "0 0 25px #FF6F91" },
        },
      },
      animation: {
        flicker: "flicker 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [animatePlugin],
}

export default config