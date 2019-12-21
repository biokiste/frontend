import React from "react";
import PropTypes from "prop-types";

function Badge({ color, children }) {
  const colorClass = `bg-${color}-200`;
  return (
    <div
      className={`m-2 px-2 border border-b-2 rounded-sm w-auto h-auto font-mono text-xs inline-block ${colorClass}`}
    >
      {children}
    </div>
  );
}

Badge.propTypes = {
  /**
   * Background color
   * @see [Tailwindcss Background Color](https://tailwindcss.com/docs/background-color)
   */
  color: PropTypes.string,
  /** Children */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default Badge;
