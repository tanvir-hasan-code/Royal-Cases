import daisyui from "daisyui"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
         
          ...import("daisyui/src/theming/themes").then(m => m.default["light"]),
          "--oklch": false, 
        },
      },
      "dark", 
    ],
  },
}