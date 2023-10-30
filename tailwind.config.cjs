/** @type {import('tailwindcss').Config} */
module.exports = {
  content:[
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js"
  ],
  theme: {
    extend: {
      boxShadow: {
        'neg': '0 -10px 15px -3px rgb(0 0 0 / 0.1), 0 -4px 6px -4px rgb(0 0 0 / 0.1)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
