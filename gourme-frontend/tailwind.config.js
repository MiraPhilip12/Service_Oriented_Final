/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gourme': '#8B5E3C',
        'gourme-dark': '#5C3A21',
        'gourme-light': '#D4A76A',
      }
    },
  },
  plugins: [],
}