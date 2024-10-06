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
          50: "#f1f4f9",
          100: "#becfe0",
          200: "#b3c7db",
          300: "#a6bed5",
          400: "#97b3ce",
          500: "#86a6c6",
          600: "#7298bc",
          700: "#5b87b1",
          800: "#4073A5",
        },
      },
    },
  },
  plugins: [],
};
export default config;
