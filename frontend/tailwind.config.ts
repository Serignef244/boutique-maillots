import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-white': '#FAFAFA',
        'brand-black': '#111111',
        'brand-accent': '#00ff87', // Re-mapped for compatibility
        pitch: '#00ff87',    // vert gazon électrique
        gold: '#FFD700',     // or pour badges
        dark: '#0a0a0a',     // noir profond
        jersey: '#111111',   // fond cards
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'], // Kept for compatibility if used
        inter: ['var(--font-inter)', 'sans-serif'],
        display: ['Bebas Neue', 'sans-serif'],
        body: ['Barlow Condensed', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 1.5s infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        marquee: 'marquee 20s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        flicker: 'flicker 3s infinite',
        spotlight: 'spotlight 4s ease-in-out infinite alternate',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 5px #00ff87)' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 15px #00ff87)' },
        },
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: '0.99',
            textShadow: '-1px -1px 0 rgba(255,255,255,0.4), 1px -1px 0 rgba(255,255,255,0.4), -1px 1px 0 rgba(255,255,255,0.4), 1px 1px 0 rgba(255,255,255,0.4), 0 -2px 8px, 0 0 2px, 0 0 5px #ff7e00, 0 0 15px #ff4444, 0 0 2px #ff7e00, 0 2px 3px #000'
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: '0.4',
            textShadow: 'none'
          }
        },
        spotlight: {
          '0%': { transform: 'translateX(-10%) scale(1.2)' },
          '100%': { transform: 'translateX(10%) scale(1.5)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(-2%)' },
          '50%': { transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
