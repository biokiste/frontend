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

export function getColumnVisibility(columns, valueKey) {
  if (Array.isArray(columns)) {
    return "";
  }
  const columnKey = Object.keys(columns).find(key =>
    columns[key].includes(valueKey)
  );
  return columnKey === "visible"
    ? columnKey
    : `invisible ${`${columnKey}:visible`}`;
}

export function getColumnWidth(columns, valueKey) {
  if (Array.isArray(columns)) {
    return columns.length < 2 ? "w-full" : `w-1/${columns.length}`;
  }
  const breakpoints = Object.keys(columns); //?
  const breakpointsWithLength = breakpoints.reduce(
    (obj, breakpoint, idx, arr) => {
      let count = 0;
      while (idx + 1 > 0) {
        count += columns[arr[idx]].length;
        idx--;
      }
      return { ...obj, [breakpoint]: count };
    },
    {}
  );
  const widths = breakpoints
    .reverse()
    .reduce((arr, breakpoint, idx, source) => {
      if (columns[breakpoint].includes(valueKey)) {
        while (idx + 1 > 0) {
          const key = source[idx];
          if (key === "visible") {
            arr.push(
              breakpointsWithLength[key] < 2
                ? "w-full"
                : `w-1/${breakpointsWithLength[key]}`
            );
          } else {
            arr.push(`${key}:w-1/${breakpointsWithLength[key]}`);
          }
          idx--;
        }
        if (breakpoint !== "visible") {
          arr.splice(0, 0, "w-0");
        }
      }
      return arr;
    }, []);
  return widths.join(" ");
}
