/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#172033',        // main text / header
        mist: '#EEF2F6',       // page background
        stamp: '#0F7B6C',      // "cleared" green
        next: '#E0A100',       // "next office" highlight
        line: '#D5DCE5',       // borders
      },
    },
  },
  plugins: [],
};
