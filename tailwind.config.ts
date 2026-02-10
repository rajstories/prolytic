import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

export default {
  content: [
    './index.html',
    './index.tsx',
    './App.tsx',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Geist', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      colors: {
        brand: {
          navy: '#0F172A',
          slate: '#475569',
          blue: '#2563EB',
          bg: '#F8FAFC'
        },
        slate: {
          850: '#1e293b'
        }
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em'
      }
    }
  },
  plugins: [animate]
} satisfies Config;
