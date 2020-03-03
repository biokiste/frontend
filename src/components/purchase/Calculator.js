import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Delete } from "react-feather";
import { useCalculator } from "./CalculatorContext";
import { getBackgroundColor, getTextColor } from "../../utils/tailwind";
import { useTranslation } from "react-i18next";

// TODO: format number showing in display using number (currency) utils
function CalculatorDisplay(props) {
  const { value } = props;

  return (
    <div className="flex mb-2">
      <div className="w-full">
        <input
          className="w-full p-2 border rounded-lg focus:outline-none focus:shadow-outline text-4xl text-right"
          aria-label="display"
          value={value}
          disabled
        />
      </div>
    </div>
  );
}

function CalculatorButton(props) {
  const {
    small = false,
    color = "blue",
    textColor = "black",
    onClick,
    value,
  } = props;

  const clear = value === "clear";
  const del = value === "delete";

  const [keyPressed = false, setKeyPressed] = useState();
  const { add, reset, remove } = useCalculator();
  const { t } = useTranslation("transaction");

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(value);
    } else if (clear) {
      reset();
    } else if (del) {
      remove();
    } else {
      add(value);
    }
  }, [clear, value, onClick, reset, add, remove, del]);

  useEffect(() => {
    const parsedValue = parseInt(value);
    const isNumber =
      typeof parsedValue === "number" &&
      Number.isInteger(parsedValue) &&
      value.length === 1;
    const handler = evt => {
      if (
        (del && evt.code === "Backspace" && !evt.shiftKey) ||
        (clear && evt.code === "Backspace" && evt.shiftKey) ||
        (value === "," && evt.code === "Comma") ||
        (!clear && evt.code.endsWith(value))
      ) {
        setKeyPressed(true);
        handleClick();
      }
    };
    (isNumber || clear || del || value === ",") &&
      document.addEventListener("keydown", handler);
    return () => {
      (isNumber || clear || del || value === ",") &&
        document.removeEventListener("keydown", handler);
    };
  }, [clear, del, value, handleClick]);

  useEffect(() => {
    if (!keyPressed) {
      return;
    }
    const timeout = setTimeout(() => setKeyPressed(false), 150);
    return () => clearTimeout(timeout);
  }, [keyPressed]);

  const bgColor = getBackgroundColor(color, keyPressed ? 700 : 500);
  const bgColorFocus = getBackgroundColor(color, 600);
  const bgColorActive = getBackgroundColor(color, 700);
  const txtColor = getTextColor(textColor, 500);
  const isSmall = small ? "px-2 text-xs" : "px-4 py-2";

  const classes = `w-full ${bgColor} focus:outline-none focus:${bgColorFocus} hover:${bgColorFocus} active:${bgColorActive} rounded font-bold ${txtColor} ${isSmall} truncate`.trimRight();

  return (
    <button
      className={classes}
      type="button"
      aria-label={t(value)}
      onClick={handleClick}
    >
      {value === "delete" ? (
        <Delete className="m-auto" />
      ) : value === "clear" ? (
        "C"
      ) : (
        t(value)
      )}
    </button>
  );
}

/**
 * Calculator for purchase section
 */
function Calculator(props) {
  const { onSubmit, categories = [] } = props;
  const { value, reset } = useCalculator();

  const handleClick = btnValue => {
    onSubmit &&
      onSubmit(btnValue, btnValue.startsWith("percent") ? `-${value}` : value);
    reset();
  };

  const filteredCategories = categories
    .filter(category => {
      const { type } = category;
      return type !== "correction";
    })
    .sort((a, b) => a.type.localeCompare(b.type));

  return (
    <>
      <CalculatorDisplay value={value} />
      <div className="flex mb-2">
        {filteredCategories.map((category, idx, arr) => {
          const { type } = category;
          return (
            <div
              key={type}
              className={`w-1/5 ${
                idx < arr.length - 1 ? "pr-1" : ""
              }`.trimRight()}
            >
              <CalculatorButton
                color={type.startsWith("percent") ? "blue" : "green"}
                value={type}
                onClick={handleClick}
                small
              />
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap">
        <div className="w-1/4 pr-1 pb-1">
          <CalculatorButton color="gray" value="7" />
        </div>
        <div className="w-1/4 pr-1 pb-1">
          <CalculatorButton color="gray" value="8" />
        </div>
        <div className="w-1/4 pr-1 pb-1">
          <CalculatorButton color="gray" value="9" />
        </div>
        <div className="w-1/4">
          <CalculatorButton color="orange" value="clear" />
        </div>
        <div className="w-1/4 pr-1 pb-1">
          <CalculatorButton color="gray" value="4" />
        </div>
        <div className="w-1/4 pr-1 pb-1">
          <CalculatorButton color="gray" value="5" />
        </div>
        <div className="w-1/4 pr-1 pb-1">
          <CalculatorButton color="gray" value="6" />
        </div>
        <div className="w-1/4">
          <CalculatorButton color="orange" value="delete" />
        </div>
        <div className="w-1/4 pr-1 pb-1">
          <CalculatorButton color="gray" value="1" />
        </div>
        <div className="w-1/4 pr-1">
          <CalculatorButton color="gray" value="2" />
        </div>
        <div className="w-1/4 pr-1">
          <CalculatorButton color="gray" value="3" />
        </div>
        <div className="w-1/2 pr-1">
          <CalculatorButton color="gray" value="0" />
        </div>
        <div className="w-1/4 pr-1">
          <CalculatorButton color="gray" value="," />
        </div>
      </div>
    </>
  );
}

Calculator.propTypes = {
  /** Handler for submitted values */
  onSubmit: PropTypes.func,
};

export default Calculator;
