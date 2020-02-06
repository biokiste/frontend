function getColor(color, intensity = 500) {
  if (/^#/.test(color)) {
    throw new Error("Use color name instead of hexadecimal identifier!");
  }
  if (["white", "black"].some(item => item === color)) {
    return color;
  }
  if (!intensity) {
    intensity = 500;
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
  return `bg-${getColor(color, intensity)}`;
}

/**
 * get tailwind-style text color
 * @param {string} color
 * @param {number?} intensity
 */
export function getTextColor(color, intensity = 500) {
  return `text-${getColor(color, intensity)}`;
}
