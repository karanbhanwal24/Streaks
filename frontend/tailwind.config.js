/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f5f5',
          100: '#e8e8e8',
          200: '#d0d0d0',
          300: '#b0b0b0',
          400: '#808080',
          500: '#333333',
          600: '#1a1a1a',
          700: '#0f0f0f',
          800: '#0a0a0a',
          900: '#000000',
        },
        success: '#4a4a4a',
        warning: '#696969',
        danger: '#2a2a2a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
