module.exports = {
  theme: {
    extend: {
      screens: {
        landscape: { raw: "(orientation: landscape)" }
      },
      width: {
        "1/7": "14.2857143%",
      }
    }
  },
  variants: {
    backgroundColor: ["responsive", "hover", "focus", "active"]
  },
  plugins: []
};
