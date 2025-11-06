/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", ".theme-dark"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primario: {
          50: "#ecfdf3",
          100: "#d1fadf",
          200: "#a6f4c5",
          500: "#16a34a",
          600: "#0f9a44",
          700: "#0b7c36"
        },
        oscuro: {
          50: "#0c1224",
          100: "#101a33",
          200: "#14213f",
          300: "#1b2b4f",
          400: "#22365f",
          500: "#2d4675"
        },
        esmeralda: {
          500: "#1fbf63",
          600: "#16a352"
        },
        neutro: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5f5",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          900: "#0f172a"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        tarjeta: "0 15px 35px -15px rgba(15, 23, 42, 0.35)"
      }
    }
  },
  plugins: []
};
