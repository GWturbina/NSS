/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFF9E6',
          100: '#FFF0BF',
          200: '#FFE699',
          300: '#FFD966',
          400: '#FFCC33',
          500: '#FFB800',
          600: '#E5A600',
          700: '#CC9400',
          800: '#996F00',
          900: '#664A00',
        },
        navy: {
          50: '#E8EBF0',
          100: '#C5CCD9',
          200: '#9FADC2',
          300: '#798EAB',
          400: '#536F94',
          500: '#2D507D',
          600: '#264066',
          700: '#1E304F',
          800: '#172038',
          900: '#0F1021',
          950: '#080810',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
      },
    },
  },
  plugins: [],
}
