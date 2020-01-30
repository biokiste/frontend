const { colors } = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    extend: {
      screens: {
        landscape: { raw: "(orientation: landscape)" },
        'dark-mode': {'raw': '(prefers-color-scheme: dark)'},
      },
      width: {
        "1/7": "14.2857143%",
      },
      colors: {
        error: colors.red,
        warning: colors.orange,
        info: colors.green,
      }
    }
  },
  variants: {
    backgroundColor: ["responsive", "hover", "focus", "active"]
  },
  plugins: []
};
