import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0a0a0f',
          secondary: '#111118',
          tertiary: '#1a1a2e',
        },
        surface: {
          primary: '#16213e',
          secondary: '#1e1e2e',
          tertiary: '#252535',
        },
        accent: {
          blue: '#0075ff',
          'blue-light': '#1e90ff',
          'blue-medium': '#3b82f6',
          'blue-hover': '#0060dd',
          'blue-dark': '#2563eb',
        },
        text: {
          primary: '#e2e8f0',
          secondary: '#94a3b8',
          muted: '#64748b',
        },
        border: {
          primary: '#2d2d3d',
          secondary: '#374151',
        },
        status: {
          success: '#22c55e',
          warning: '#f59e0b',
          danger: '#ef4444',
          info: '#3b82f6',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
