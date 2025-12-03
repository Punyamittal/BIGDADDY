/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vit: {
          primary: '#FF6B35',
          secondary: '#004E89',
          accent: '#1A659E',
          dark: '#0D1B2A',
          light: '#F7F7F7',
        },
      },
    },
  },
  plugins: [],
}


