export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'aptos': ['Aptos', 'system-ui', 'sans-serif'],
      },
      colors: {
        'primary': '#06B6D4',        // Soft cyan/teal
        'secondary': '#0EA5E9',      // Soft blue
        'accent': '#14B8A6',         // Soft teal-green
        'dark-glass': 'rgba(5, 20, 40, 0.45)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(6, 182, 212, 0.2), 0 0 40px rgba(14, 165, 233, 0.1)',
        'glow-strong': '0 0 30px rgba(6, 182, 212, 0.25), 0 0 60px rgba(14, 165, 233, 0.15)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      animation: {
        'gentle-glow': 'gentle-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'gentle-glow': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(6, 182, 212, 0.15), 0 0 30px rgba(14, 165, 233, 0.05)' },
          '50%': { boxShadow: '0 0 25px rgba(6, 182, 212, 0.25), 0 0 50px rgba(14, 165, 233, 0.1)' },
        }
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
