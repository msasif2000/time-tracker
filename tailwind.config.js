/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    colors: {
      transparent: 'transparent',
      'prime': '#8ECAE6',
      'white': '#ffffff',
      'deepSky': '#219EBC',
      'midnight': '#023047',
      'orange': '#FFB703',
      'deepO': '#FB8500',
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xll': '1280px',
      'xxl': '1536px',
    },
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
      ],
  },
  plugins: [require("daisyui")],
}

