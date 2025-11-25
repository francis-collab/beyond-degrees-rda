// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bdr-blue': '#00A1D6',
        'bdr-green': '#00A651',
        'bdr-yellow': '#FCD116',
      },
      backgroundImage: {
        'gradient-blue': 'linear-gradient(to bottom, #00A1D6, #80d0f0)',
        'gradient-yellow': 'linear-gradient(to bottom, #FCD116, #fce88a)',
        'gradient-green': 'linear-gradient(to bottom, #00A651, #80c8a0)',
        'gradient-hero': 'linear-gradient(to right, #00A1D6, #FCD116, #00A651)',
        'gradient-cta': 'linear-gradient(to right, #FCD116, #00A651)',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'spin-fast': 'spin 0.5s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;