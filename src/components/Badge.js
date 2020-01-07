import React from "react";
import PropTypes from "prop-types";
import { getBackgroundColor } from "../utils/tailwind";

/**
 * Simple Badge
 */
function Badge({ color, children }) {
  const bgColor = getBackgroundColor(color, 200);
  return (
    <div
      className={`m-2 px-2 border border-b-2 rounded-sm w-auto h-auto font-mono text-xs inline-block ${bgColor}`}
    >
      {children}
    </div>
  );
}

Badge.propTypes = {
  /**
   * Background color name
   */
  color: PropTypes.string,
  /** Children */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

Badge.defaultProps = {
  color: "white"
};

export default Badge;
