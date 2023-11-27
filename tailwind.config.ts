import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import { createThemes } from "tw-colors";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [
    createThemes({
      light: {
        text: "#000000",
        background: "#ffffff",
        primary: "#8fb3ff",
        secondary: "#ebf1ff",
        accent: "#d41d6c",
      },
      dark: {
        text: "#ffffff",
        background: "#444444",
        primary: "#8fb3ff",
        secondary: "#001952",
        accent: "#f199bf",
      },
    }),
  ],
} satisfies Config;
