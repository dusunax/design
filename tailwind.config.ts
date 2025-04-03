import type { Config } from "tailwindcss"
const config: Config = {
  darkMode: ["class"],
  content: [
    "./multi-touch/**/*.{ts,tsx}",
    "./stories/**/*.{ts,tsx}"
  ],
  theme: {},
  plugins: [require("tailwindcss-animate")],
}

export default config

