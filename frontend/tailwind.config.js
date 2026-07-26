/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Clean Professional Light Palette
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#16a34a',
          600: '#15803d',
          700: '#166534',
          900: '#14532d',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        accent: {
          indigo: '#4f46e5',
          violet: '#7c3aed',
          emerald: '#059669',
          amber: '#d97706',
          rose: '#e11d48',
          teal: '#0d9488',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f8fafc',
          subtle: '#f1f5f9',
          border: '#e2e8f0',
        },
        text: {
          primary: '#0f172a',
          secondary: '#475569',
          muted: '#64748b',
          light: '#94a3b8',
        },
        // Legacy mappings
        forest: {
          DEFAULT: '#0f172a',
          light: '#1e293b',
          dark: '#020617',
        },
        terracotta: {
          DEFAULT: '#e11d48',
          light: '#f43f5e',
          dark: '#be123c',
        },
        sand: {
          DEFAULT: '#d97706',
          light: '#f59e0b',
          dim: '#b45309',
        },
        cream: {
          DEFAULT: '#f8fafc',
          dark: '#f1f5f9',
          darker: '#e2e8f0',
        },
        neutralDark: '#0f172a',
        neutralGrey: '#64748b',
      },
      fontFamily: {
        sans: ['Inter', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'px-8': '8px',
        'px-16': '16px',
        'px-20': '20px',
        'px-24': '24px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 12px 32px -4px rgba(15, 23, 42, 0.1), 0 4px 12px -2px rgba(15, 23, 42, 0.05)',
        'indigo-sm': '0 4px 14px 0 rgba(79, 70, 229, 0.25)',
        'rose-sm': '0 4px 14px 0 rgba(225, 29, 72, 0.25)',
        'emerald-sm': '0 4px 14px 0 rgba(5, 150, 105, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
