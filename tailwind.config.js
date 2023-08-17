/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        lightBlue: "#249C98",
        darkGray: "#222423",
        lightGray: "#DCE0DD",
        mainRed: "#DC3237",
        mainRedLighter: "#FF454A",
      },
      scale: {
        102: "1.02",
      },
    },
  },
  plugins: [],
};
