import type { Config } from "tailwindcss";

const config: Config = {
  // Aktifkan dark mode berbasis class (Standar Shadcn)
  darkMode: "class",
  
  // Beritahu Tailwind di mana saja letak file React Anda
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Wajib ada jika Anda pakai folder src
  ],
  
  theme: {
    extend: {
      // Konfigurasi Animasi Accordion yang Super Smooth
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.4s cubic-bezier(0.87, 0, 0.13, 1)",
        "accordion-up": "accordion-up 0.4s cubic-bezier(0.87, 0, 0.13, 1)",
      },
    },
  },
  
  // Panggil plugin yang baru saja kita instal
  plugins: [require("tailwindcss-animate")],
};

export default config;