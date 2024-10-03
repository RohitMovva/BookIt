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
        blue: {
          50: "#E3F2FD",
          100: "#E1EAF1",
          200: "#90C9E8",
          300: "#65A9E0",
          400: "#3E8DC6",
          500: "#1E70AD",
          600: "#1B6B9B",
          700: "#1A6590",
          800: "#4073A5",
          900: "#0F4C74",
        },
      },
      fontSize: {
        h1: "6rem",
      },
    },
  },
  plugins: [],
};
export default config;
