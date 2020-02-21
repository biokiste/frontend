const { colors } = require("tailwindcss/defaultTheme");

module.exports = {
  theme: {
    extend: {
      screens: {
        landscape: { raw: "(orientation: landscape)" },
      },
      width: {
        "1/1": "100%",
        "1/7": "14.2857143%",
        "1/8": "0.125%",
      },
      colors: {
        error: colors.red,
        warning: colors.orange,
        info: colors.green,
      },
    },
  },
  variants: {
    backgroundColor: ["responsive", "hover", "focus", "active"],
  },
  plugins: [],
};
