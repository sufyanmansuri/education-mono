/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
        },
      },
    },
    colors: {
      white: "rgba(255,255,255,1)",
      yellow: "rgba(228,183,92,1)",
      red: "rgba(222,90,90,1)",
      blue: "rgba(117,133,240,1)",
      black: "rgba(47,46,65,1)",
      transparent: "rgba(0,0,0,0)",
      opaque: "rgba(255,255,255, 0.5)",
      green: "green",
    },
  },
  plugins: [],
};
