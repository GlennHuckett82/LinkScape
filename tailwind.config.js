/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1E88E5',
          dark: '#1565C0',
          light: '#90CAF9'
        }
      }
    }
  },
  plugins: []
};
