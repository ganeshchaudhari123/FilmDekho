import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'accent-gold': '#FFD700',
        'accent-red': '#E50914',
        'dark-bg': '#0A0A0A',
        'surface-dark': '#121212',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(to right, #FFD700, #FFED4E)',
        'red-gradient': 'linear-gradient(to right, #E50914, #FF1F2D)',
      },
    },
  },
  plugins: [],
};

export default config;
