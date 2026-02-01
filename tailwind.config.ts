import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3f2',
          100: '#ffe4e1',
          200: '#ffcec8',
          300: '#ffaca2',
          400: '#ff7b6d',
          500: '#f85040',
          600: '#e53421',
          700: '#c12716',
          800: '#a02416',
          900: '#84251a',
        },
      },
    },
  },
  plugins: [],
}
export default config
