import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getBackgroundColor, getTextColor } from "../../utils/tailwind";

function Button(props) {
  const { value, color, textColor, disabled, onClick, focus } = props;

  const [isFocused, setIsFocused] = useState(false);

  const ref = useRef();

  const bgColor = getBackgroundColor(color, 300);
  const bgColorFocus = disabled ? bgColor : getBackgroundColor(color, 500);
  const bgColorActive = getBackgroundColor(color, 700);
  const txtColor = getTextColor(textColor, 500);
  const isDisabled = disabled ? "opacity-25 pointer-events-none" : "";

  useEffect(() => {
    setIsFocused(focus);
  }, [focus]);

  useEffect(() => {
    if (isFocused) {
      ref.current && ref.current.focus();
    } else {
      ref.current && ref.current.blur();
    }
  }, [isFocused]);

  const handleClick = () => {
    onClick && onClick();
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  return (
    <button
      ref={ref}
      onClick={handleClick}
      onFocus={handleFocus}
      className={`w-full md:w-auto px-4 py-2 rounded ${bgColor} focus:outline-none focus:${bgColorFocus} hover:${bgColorFocus} active:${bgColorActive} ${txtColor} ${isDisabled}`.trimRight()}
    >
      {value}
    </button>
  );
}

Button.propTypes = {
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  color: PropTypes.string,
  textColor: PropTypes.string,
  disabled: PropTypes.bool
};

Button.defaultProps = {
  color: "gray",
  textColor: "black",
  disabled: false,
  focus: false
};

export default Button;
