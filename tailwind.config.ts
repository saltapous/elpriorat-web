import type { Config } from "tailwindcss";
import lineClamp from "@tailwindcss/line-clamp";
import typography from "@tailwindcss/typography";

export default {
  content: [
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./pages/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [lineClamp, typography],
} satisfies Config;

