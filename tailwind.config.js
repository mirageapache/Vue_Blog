/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a0',
          800: '#075985',
          900: '#0c4a6e'
        }
      },
      width: {
        minus50: 'calc(100dvw - 50px)',
        minus150: 'calc(100dvw - 150px)',
      },
      height: {
        minus120: 'calc(100dvh - 120px)',
        minus180: 'calc(100dvh - 180px)',
        minus240: 'calc(100dvh - 240px)',
        minus280: 'calc(100dvh - 280px)',
        minus325: 'calc(100dvh - 325px)',
      },
      maxHeight: {
        '70vh': '70vh',
        '80vh': '80vh',
      },
    }
  },
  plugins: [],
  corePlugins: {
    preflight: true
  }
};
