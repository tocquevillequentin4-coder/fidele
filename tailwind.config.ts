import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        marine: "#1B2A4A",
        corail: "#E8613C",
        creme: "#FAF6F0",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)"],
        sans: ["var(--font-public-sans)"],
      },
    },
  },
  plugins: [],
};

export default config;
