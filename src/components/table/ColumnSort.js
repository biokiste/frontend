import React from "react";
import PropTypes from "prop-types";
import { ChevronDown, ChevronUp } from "react-feather";

function ColumnSort(props) {
  const { sortKey, direction, value, onActive, onDirection, disabled } = props;

  const title = props.title || value;

  const handleClick = () => {
    if (sortKey !== value) {
      onActive && onActive(value);
    } else {
      onDirection && onDirection(direction * -1);
    }
  };

  return sortKey === value ? (
    <>
      <button
        className={`focus:outline-none w-full flex flex-row justify-center font-bold ${disabled &&
          "cursor-default"}`.trimRight()}
        onClick={handleClick}
        disabled
      >
        <div className="mr-2 truncate">{title}</div>
        {direction > 0 ? <ChevronDown size="24" /> : <ChevronUp size="24" />}
      </button>
    </>
  ) : (
    <button
      className={`focus:outline-none w-full font-bold ${disabled &&
        "cursor-default"}`.trimRight()}
      onClick={handleClick}
    >
      {title}
    </button>
  );
}

ColumnSort.propTypes = {
  /** Current active column */
  sortKey: PropTypes.string,
  /** Direction to sort */
  direction: PropTypes.oneOf([1, -1]),
  /** Key of column to sort */
  value: PropTypes.string.isRequired,
  /** Title of column to sort */
  title: PropTypes.string,
  /** Callback to handle activity change */
  onActive: PropTypes.func,
  /** Callback to handle direction change */
  onDirection: PropTypes.func,
};

export default ColumnSort;
