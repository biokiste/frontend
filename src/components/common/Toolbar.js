import React from "react";
import { getTextColor } from "../../utils/tailwind";
import { Link } from "react-router-dom";

function ToolbarItem(props) {
  const { icon, color, path } = props;
  const Icon = React.cloneElement(icon, {
    size: 32,
  });

  const defaultColor = getTextColor(color, 700);

  return (
    <button
      className={`${defaultColor} focus:outline-none hover:opacity-50 p-2`}
    >
      <Link to={path}>{Icon}</Link>
    </button>
  );
}

function Toolbar(props) {
  const { children } = props;
  const elements =
    children &&
    React.Children.toArray(children).map((child, idx, arr) =>
      React.cloneElement(child, {
        color: "black",
        count: arr.length,
        index: idx,
      })
    );
  return (
    <div className="fixed bottom-0 w-full sm:w-auto landscape:w-auto h-16 sm:h-full landscape:h-full flex flex-row sm:flex-col landscape:flex-col items-center justify-between sm:justify-start landscape:justify-start px-4 sm:px-2 landscape:px-2 py-2 sm:py-2 landscape:py-2 border-t-2 sm:border-t-0 landscape:border-t-0 sm:border-r-2 landscape:border-r-2 bg-white">
      {elements}
    </div>
  );
}

export { Toolbar, ToolbarItem };
