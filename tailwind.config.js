module.exports = {
  theme: {
    extend: {
      screens: {
        landscape: { raw: "(orientation: landscape)" }
      }
    }
  },
  variants: {
    backgroundColor: ["responsive", "hover", "focus", "active"]
  },
  plugins: []
};
