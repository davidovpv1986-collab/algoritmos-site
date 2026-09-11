import type { Config } from "tailwindcss";

const rgb = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", lg: "2rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        deep: rgb("--deep"),
        base: rgb("--bg"),
        surface: rgb("--surface"),
        surface2: rgb("--surface-2"),
        foreground: rgb("--text"),
        muted: rgb("--muted"),
        primary: rgb("--primary"),
        strong: rgb("--primary-strong"),
        aqua: rgb("--aqua"),
        light: rgb("--light"),
        line: rgb("--border"),
        steel: rgb("--gray"),
      },
      fontFamily: {
        sans: ["Roboto", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
