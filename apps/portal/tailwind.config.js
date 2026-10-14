/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // SugarCoach Light Theme
        'sc-bg': '#F5F7FA',
        'sc-surface': '#FFFFFF',
        'sc-surface-hover': '#F0F4F8',
        'sc-border': 'rgba(0,0,0,0.08)',
        'sc-teal': '#00D4AA',
        'sc-teal-dark': '#009E80',
        'sc-teal-light': 'rgba(0,212,170,0.10)',
        'sc-text-primary': '#1A1D23',
        'sc-text-secondary': '#6B7280',
        'sc-text-muted': '#9CA3AF',
        // Glucose states
        'glucose-normal': '#00D4AA',
        'glucose-hypo': '#FF4757',
        'glucose-hyper': '#FFA502',
      },
      boxShadow: {
        'sc-subtle': '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
        'sc-min': '0 1px 2px rgba(0,0,0,0.04)',
      },
      borderRadius: {
        'sc-lg': '8px',
        'sc-md': '6px',
        'sc-full': '9999px',
      },
    },
  },
  plugins: [],
}
