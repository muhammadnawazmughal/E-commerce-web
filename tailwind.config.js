/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          50: '#FDFBF9',
          100: '#FAF5EE',
          200: '#F2E8DC',
          300: '#E6D3C1',
          400: '#D5B79C',
          500: '#C5A07E',
          600: '#B08864',
          700: '#8E6847',
          800: '#64472E',
          900: '#3D2A1A',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F3E5AB',
          hover: '#C59E28',
          dark: '#997A1E'
        },
        rose: {
          blush: '#FDF5F2',
          petal: '#F7E7E2',
          deep: '#B34A5F',
          noir: '#4A1D27'
        },
        noir: {
          900: '#111113',
          800: '#1A1A1E',
          700: '#26262B',
          600: '#38383F',
          500: '#52525C'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px rgba(212, 175, 55, 0.25)',
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.07)',
        'elevated': '0 10px 30px -5px rgba(17, 17, 19, 0.08)'
      }
    },
  },
  plugins: [],
}
