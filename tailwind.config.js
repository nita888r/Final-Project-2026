/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brown: '#4A2F1D',
        cream: '#F5ECD9',
        creamdark: '#E8DAB9',
        gold: '#C9A24B',
        bottle: '#2F4F3E',
        brick: '#8B3A2E',
        ink: '#2B1B10',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-dm)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
