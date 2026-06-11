// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet Management — Tailwind CSS Configuration
// v3.21.0 · Custom design tokens mapped to CSS custom properties
// ══════════════════════════════════════════════════════════════

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './**/*.{ts,tsx}',
  ],

  darkMode: ['class', '[data-theme="dark"]'],

  theme: {
    extend: {
      // ── Brand Colors ─────────────────────────────────────
      colors: {
        be: {
          primary:    'var(--be-primary)',
          hover:      'var(--be-primary-hover)',
          dim:        'var(--be-primary-dim)',
          glow:       'var(--be-primary-glow)',
          secondary:  'var(--be-secondary)',
          accent:     'var(--be-accent)',
        },
        surface: {
          0: 'var(--be-bg-0)',
          1: 'var(--be-bg-1)',
          2: 'var(--be-bg-2)',
          3: 'var(--be-bg-3)',
          4: 'var(--be-bg-4)',
        },
        border: {
          DEFAULT: 'var(--be-border)',
          light:   'var(--be-border-light)',
          focus:   'var(--be-border-focus)',
        },
        text: {
          primary:   'var(--be-text-primary)',
          secondary: 'var(--be-text-secondary)',
          muted:     'var(--be-text-muted)',
          disabled:  'var(--be-text-disabled)',
          inverse:   'var(--be-text-inverse)',
        },
        status: {
          success:     'var(--be-success)',
          'success-bg': 'var(--be-success-dim)',
          warning:     'var(--be-warning)',
          'warning-bg': 'var(--be-warning-dim)',
          danger:      'var(--be-danger)',
          'danger-bg': 'var(--be-danger-dim)',
          info:        'var(--be-info)',
          'info-bg':   'var(--be-info-dim)',
        },
        vertical: {
          tanker:     'var(--be-tanker)',
          'tanker-bg': 'var(--be-tanker-dim)',
          bus:        'var(--be-bus)',
          'bus-bg':   'var(--be-bus-dim)',
          taxi:       'var(--be-taxi)',
          'taxi-bg':  'var(--be-taxi-dim)',
        },
      },

      // ── Typography ───────────────────────────────────────
      fontFamily: {
        sans:  ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono:  ['JetBrains Mono', 'SF Mono', 'Cascadia Code', 'Fira Code', 'monospace'],
        arabic: ['IBM Plex Sans Arabic', 'Noto Sans Arabic', 'sans-serif'],
      },

      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],      // 11px
        xs:    ['0.75rem',   { lineHeight: '1.125rem' }],   // 12px
        sm:    ['0.8125rem', { lineHeight: '1.25rem' }],    // 13px
        base:  ['0.875rem',  { lineHeight: '1.375rem' }],   // 14px
        lg:    ['1rem',      { lineHeight: '1.5rem' }],     // 16px
        xl:    ['1.25rem',   { lineHeight: '1.75rem' }],    // 20px
        '2xl': ['1.5rem',    { lineHeight: '2rem' }],       // 24px
        '3xl': ['1.875rem',  { lineHeight: '2.25rem' }],    // 30px
      },

      // ── Spacing ──────────────────────────────────────────
      spacing: {
        'sidebar':     'var(--be-sidebar-w)',
        'sidebar-sm':  'var(--be-sidebar-collapsed)',
        'topbar':      'var(--be-topbar-h)',
      },

      // ── Border Radius ────────────────────────────────────
      borderRadius: {
        card: 'var(--be-card-radius)',
      },

      // ── Box Shadow ───────────────────────────────────────
      boxShadow: {
        'be-sm':   'var(--be-shadow-sm)',
        'be-md':   'var(--be-shadow-md)',
        'be-lg':   'var(--be-shadow-lg)',
        'be-glow': 'var(--be-shadow-glow)',
      },

      // ── Transitions ──────────────────────────────────────
      transitionTimingFunction: {
        'be': 'var(--be-ease)',
      },
      transitionDuration: {
        'fast': 'var(--be-duration-fast)',
        'be':   'var(--be-duration)',
        'slow': 'var(--be-duration-slow)',
      },

      // ── Z-Index Scale ────────────────────────────────────
      zIndex: {
        'sidebar':  '40',
        'topbar':   '50',
        'dropdown': '60',
        'overlay':  '70',
        'modal':    '80',
        'toast':    '90',
        'command':  '100',
      },

      // ── Animations ───────────────────────────────────────
      keyframes: {
        'fade-in':     { from: { opacity: '0' }, to: { opacity: '1' } },
        'fade-in-up':  { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'fade-in-down': { from: { opacity: '0', transform: 'translateY(-8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'scale-in':    { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
        'slide-up':    { from: { transform: 'translateY(100%)' }, to: { transform: 'translateY(0)' } },
        shimmer:       { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        'fade-in':     'fade-in 0.2s var(--be-ease)',
        'fade-in-up':  'fade-in-up 0.3s var(--be-ease)',
        'fade-in-down': 'fade-in-down 0.3s var(--be-ease)',
        'scale-in':    'scale-in 0.2s var(--be-ease)',
        'slide-up':    'slide-up 0.3s var(--be-ease)',
        shimmer:       'shimmer 1.5s infinite',
      },

      // ── Screens (Breakpoints) ────────────────────────────
      screens: {
        xs:  '480px',
        sm:  '640px',
        md:  '768px',
        lg:  '1024px',
        xl:  '1280px',
        '2xl': '1536px',
      },
    },
  },

  plugins: [],
};

export default config;
