/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFBF9',
          100: '#FAF7F4',
          200: '#F7F2EE', // Primary warm ivory background
          300: '#EFE8E2',
          400: '#E4DCD3',
          500: '#D6CBC0',
        },
        rose: {
          accent: '#B76E79', // dusty rose
          light: '#F8EEF0',
          hover: '#A35E69',
          deep: '#7B3F4C', // deep berry
          dark: '#5C2D38',
        },
        berry: {
          light: '#9E5B6A',
          DEFAULT: '#7B3F4C',
          dark: '#582A35',
        },
        charcoal: {
          900: '#1C1A19', // Primary near-black text
          700: '#3D3936',
          600: '#6B6560', // Secondary text
          400: '#9C958E', // Muted text
          200: '#E8E2DC', // Subtle border
          100: '#F2EDE8',
        },
        gold: {
          vip: '#C9A961', // Gold accent for VIP
          light: '#F4ECE0',
          dark: '#A6843A',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Didot', 'Bodoni MT', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(28, 26, 25, 0.05)',
        'card': '0 2px 10px rgba(28, 26, 25, 0.04)',
        'luxury': '0 20px 40px -15px rgba(123, 63, 76, 0.08)',
        'vip': '0 8px 30px rgba(201, 169, 97, 0.2)',
      },
      borderRadius: {
        'luxury': '6px',
      },
      letterSpacing: {
        'ultra-wide': '0.2em',
        'subtle-wide': '0.08em',
      }
    },
  },
  plugins: [],
}
