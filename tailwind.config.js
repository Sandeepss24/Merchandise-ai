/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc',
        surface: '#ffffff',
        border: '#e2e8f0',
        primary: '#F04623',
        'primary-hover': '#d93f20',
        'primary-light': '#fdf2f0',
        'primary-surface': '#fff5f3',
        text: '#1e293b',
        'text-secondary': '#64748b',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
      }
    },
  },
  plugins: [],
}
