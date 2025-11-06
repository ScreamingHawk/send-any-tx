/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        retro: {
          bg: '#0a0a0a',
          surface: '#1a1a1a',
          accent: '#ff6b35',
          secondary: '#4ecdc4',
          text: '#f5f5f5',
          'text-muted': '#a0a0a0',
        },
      },
      fontFamily: {
        retro: ['Courier New', 'monospace'],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
      },
    },
  },
  plugins: [],
}
