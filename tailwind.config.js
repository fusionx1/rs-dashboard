/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      height: {
        19.28: "4.82rem",
        18: "4.5rem",

      },
      width: {
        19.28: "4.82rem",
        18: "4.5rem",
      },
    },
    colors: {
      rhb: "#E40613",
      white: "#FFFFFF",
      black: "#000000",
      red400: "#F87171",
      red500: "#EF4444",
      indigo300: "#A5B4FC",
      sersa: "#FF6300",
      sersa2: "#F5F5F5",
      innovitas: "#168ECF",
      innovitasHover: "#146692",
    },
    rotate: {
      21: "21deg",
    },
  },
  plugins: [],
};
