/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-lime': '#39FF14',
        'neon-green': '#39FF14',
      },
    },
  },
  plugins: [],
};
