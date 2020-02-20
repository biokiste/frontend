import React from "react";
import PropTypes from "prop-types";
import { getColumnVisibility, getColumnWidth } from "../../utils/tailwind";

function Row(props) {
  const { index, columns, values } = props;

  const columnKeys = Array.isArray(columns)
    ? columns
    : Object.keys(columns).reduce(
        (keys, breakpoint) => keys.concat(columns[breakpoint]),
        []
      );

  return (
    <tr className={index % 2 === 0 ? "bg-gray-100" : ""}>
      {columnKeys.map(key => {
        const visibility = getColumnVisibility(columns, key);
        const width = getColumnWidth(columns, key);
        return (
          <td
            className={`border px-4 py-2 text-center truncate ${visibility} ${width}`.trimRight()}
          >
            {values[key]}
          </td>
        );
      })}
    </tr>
  );
}

Row.propTypes = {
  /** Index of row */
  index: PropTypes.number.isRequired,
  /** Column names of table */
  columns: PropTypes.oneOf([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.objectOf(PropTypes.strings),
  ]),
  /** Values of row */
  values: PropTypes.array,
};

export default Row;
