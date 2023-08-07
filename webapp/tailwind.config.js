/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fadeIn': 'fade .3s ease-in-out'
      },
      keyframes: {
        fade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      colors: {
        'primary': { // pink-lace
          '50': '#fff0f8',
          '100': '#ffd8ef',
          '200': '#ffc9ea',
          '300': '#ff9cd7',
          '400': '#ff5fba',
          '500': '#ff319d',
          '600': '#f50d78',
          '700': '#d6005d',
          '800': '#b0044c',
          '900': '#920943',
          '950': '#5a0024',
        },
        'secondary': { // powder-blue
          '50': '#f0fafb',
          '100': '#daf1f3',
          '200': '#aadee3',
          '300': '#89cfd7',
          '400': '#51b2bf',
          '500': '#3596a5',
          '600': '#2f7a8b',
          '700': '#2c6472',
          '800': '#2b535f',
          '900': '#284751',
          '950': '#162e36',
        },
        'warning': { // dixie
          '50': '#fefbec',
          '100': '#faf3cb',
          '200': '#f5e592',
          '300': '#efd25a',
          '400': '#ebbf34',
          '500': '#e4a11b',
          '600': '#ca7d15',
          '700': '#a85b15',
          '800': '#884618',
          '900': '#703a17',
          '950': '#401d08',
        },
        'neutral': { // stone
          '50': '#fafaf9',
          '100': '#f5f5f4',
          '200': '#e7e5e4',
          '300': '#d6d3d1',
          '400': '#a8a29e',
          '500': '#78716c',
          '600': '#57534e',
          '700': '#44403c',
          '800': '#292524',
          '900': '#1c1917',
          '950': '#0c0a09',
        },

        'success': '#14A44D',
        'danger': '#DC4C64',
        'info': '#54B4D3',
        'light': '#F9FAFB',
      }
    },
  },
  plugins: [],
}

