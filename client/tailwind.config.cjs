/** @type {import('tailwindcss').Config} */

const colors =require('tailwindcss/colors')

module.exports = {
  darkMode : 'class',
  content: [
    "./src/**/*.{html,tsx}",
    "*.{html,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        facebook: '#385499',
        facebookHover: '#314a86',
        twitter: '#1d9bf0',
        twitterHover:'#43aff7',
        lightBackground: '#F1F2F3',
        darkBackground: colors.gray
      },
    },
  },
  plugins: [
  ],
}
