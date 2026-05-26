/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          hover: '#818cf8',
        },
        dark: {
          DEFAULT: '#0f0f13',
          card: '#1a1a24',
          border: '#2a2a3a',
        },
      },
    },
  },
  plugins: [],
}
