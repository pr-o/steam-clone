import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/renderer/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'Arial', 'Helvetica', 'sans-serif'],
      },
      colors: {
        // shadcn/ui CSS variable tokens
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Steam brand tokens (raw hex for direct use)
        steam: {
          // Backgrounds
          bg:      '#171a21',
          panel:   '#1b2838',
          card:    '#16202d',
          cardHover: '#1e3040',
          sidebar: '#2a475e',
          field:   '#316282',
          banner:  '#1e2837',
          // Text
          text:       '#c7d5e0',
          textMuted:  '#8f98a0',
          textDim:    '#738895',
          link:       '#66c0f4',
          linkHover:  '#acdbf5',
          navActive:  '#ffffff',
          navDefault: '#c6d4df',
          // Brand
          cerulean:     '#00adee',
          blue:         '#1a9fff',
          accentLight:  '#66c0f4',
          accentPale:   '#acdbf5',
          // Interactive
          btnPrimary:      '#4c7b8a',
          btnPrimaryHover: '#67c1f5',
          btnGreen:        '#5c7e10',
          btnGreenHover:   '#a4d007',
          install:         '#5dade2',
          installHover:    '#1a9fff',
          // Price
          discountBg:   '#4c6b22',
          discountText: '#a4d007',
          origPrice:    '#738895',
          salePrice:    '#acdbf5',
          // Review
          positive: '#66c0f4',
          mixed:    '#b9a074',
          negative: '#c34741',
          // Status
          online:  '#57cbde',
          inGame:  '#90ba3c',
          offline: '#898989',
          // Border
          borderSubtle: '#2a3f5a',
          borderMedium: '#4b6a8b',
          borderStrong: '#67c1f5',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
