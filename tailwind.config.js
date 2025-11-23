/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      screens: {
        "h-sm": { raw: "(max-height: 600px)" },
        "h-md": { raw: "(max-height: 800px)" },
        "h-lg": { raw: "(min-height: 801px)" },
      },
    },
  },
  plugins: [],
};
