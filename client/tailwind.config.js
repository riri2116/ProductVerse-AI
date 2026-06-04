/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          light: '#f8fafc',
          dark: '#030712'
        },
        panel: {
          light: 'rgba(255, 255, 255, 0.75)',
          dark: 'rgba(15, 23, 42, 0.65)'
        },
        accent: {
          violet: '#8b5cf6',
          emerald: '#10b981',
          crimson: '#ef4444',
          gold: '#f59e0b'
        }
      },
      backdropBlur: {
        xs: '2px',
        md: '12px',
        xl: '32px'
      },
      boxShadow: {
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.08), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)'
      },
      animation: {
        'gradient-shift': 'gradientShift 8s ease infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' }
        }
      }
    },
  },
  plugins: [],
}
