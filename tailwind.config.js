/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f3f1ff',
          100: '#ebe5ff',
          200: '#d9ceff',
          300: '#bca7ff',
          400: '#9a78ff',
          500: '#7c4dff',
          600: '#6b2ef7',
          700: '#5b1fe0',
          800: '#4a1ab5',
          900: '#3d1791',
          950: '#240b5a',
        },
        ink: {
          950: '#07060d',
          900: '#0b0a14',
          800: '#11101c',
          700: '#191726',
          600: '#222033',
        },
      },
      backgroundImage: {
        'radial-glow':
          'radial-gradient(ellipse at top, rgba(124,77,255,0.25), transparent 50%), radial-gradient(ellipse at bottom right, rgba(38,135,255,0.18), transparent 60%)',
        'mesh-dark':
          'radial-gradient(at 20% 10%, rgba(124,77,255,0.30) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(38,135,255,0.18) 0px, transparent 55%), radial-gradient(at 70% 90%, rgba(255,77,210,0.14) 0px, transparent 55%)',
      },
      boxShadow: {
        glow: '0 0 30px rgba(124,77,255,0.45)',
        card: '0 10px 30px -10px rgba(0,0,0,0.5)',
        soft: '0 8px 24px -10px rgba(0,0,0,0.25)',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient': 'gradient 8s ease infinite',
        'wave': 'wave 1.2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        gradient: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
    },
  },
  plugins: [],
};
