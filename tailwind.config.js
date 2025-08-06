/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        green: {
          400: "#4ade80", // lime-like
          700: "#15803d", // forest green
          800: "#166534", // darker forest green
        },
        red: {
          600: "#dc2626", // error text
        },
      },
    },
  },
  plugins: [],
};
