function getColor(color, intensity = 500) {
  if (/^#/.test(color)) {
    throw new Error("Use color name instead of hexadecimal identifier!");
  }
  if (["white", "black"].some(item => item === color)) {
    return color;
  }
  const validIntensity = Math.round(intensity / 100) * 100;
  return `${color}-${validIntensity}`;
}

/**
 * get tailwind-style background color
 * @param {string} color
 * @param {number?} intensity
 */
export function getBackgroundColor(color, intensity = 500) {
  if (["white", "black"].some(item => item === color)) {
    const opposite = color === "white" ? "black" : "white";
    return `bg-${color} dark-mode:bg-${opposite}`;
  }
  return `bg-${getColor(color, intensity)} dark-mode:bg-${getColor(color, 1000 - intensity)}`;
}

/**
 * get tailwind-style text color
 * @param {string} color
 * @param {number?} intensity
 */
export function getTextColor(color, intensity = 500) {
  if (["white", "black"].some(item => item === color)) {
    const opposite = color === "white" ? "black" : "white";
    return `text-${color} dark-mode:text-${opposite}`;
  }
  return `text-${getColor(color, intensity)}  dark-mode:text-${getColor(color, 1000 - intensity)}`;
}
