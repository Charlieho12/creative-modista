import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#fff7f8",
          100: "#ffe8ec",
          200: "#f7c8d1",
          300: "#ec9bac",
          400: "#d86f86",
          500: "#bd4d67"
        },
        linen: "#f7efe7",
        champagne: "#d6b56d",
        ink: "#171316"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "ui-sans-serif", "system-ui"],
        serif: ["var(--font-serif)", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 19, 22, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
