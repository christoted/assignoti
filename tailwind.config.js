const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans]
      }
    },
    fontFamily: {
      'display': ['Quicksand', 'sans-serif'],
      'body': ['Inter', 'sans-serif']
    },
  },
  variants: {},
  plugins: [],
}