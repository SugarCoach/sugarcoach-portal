/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glucose: {
          hypo: '#EF4444',
          normal: '#10B981',
          hyper: '#F59E0B',
          warning: '#9333EA',
        },
      },
    },
  },
  plugins: [],
}
