/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#3B71CA',
        'secondary': '#9FA6B2',
        'success': '#14A44D',
        'danger': '#DC4C64',
        'warning': '#E4A11B',
        'info': '#54B4D3',
        'light': '#F9FAFB',
        'dark': '#1F2937'
      }
    },
  },
  plugins: [],
}

