/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 950: '#0f1238', 900: '#151a4a', 800: '#1c2260', 700: '#262d78' },
        brand: { 50: '#f1efff', 100: '#e4e0ff', 200: '#c9c1ff', 400: '#8b7cff', 500: '#6d5dfc', 600: '#5b49ee', 700: '#4a39cc' },
        gold: { 400: '#f3c460', 500: '#e8ad35', 600: '#c98f1c' },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Noto Sans Arabic"', '"Noto Sans Bengali"', 'system-ui', 'sans-serif'],
      },
      boxShadow: { card: '0 1px 2px rgba(16,24,40,.04), 0 4px 16px rgba(16,24,40,.06)' },
    },
  },
  plugins: [],
}
