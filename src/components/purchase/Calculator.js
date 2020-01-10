import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faBackspace } from "@fortawesome/free-solid-svg-icons";
import { useCalculator } from "./CalculatorContext";
import { getBackgroundColor, getTextColor } from "../../utils/tailwind";
import { PurchaseCategories } from "../../consts";

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
    clear = false,
    del = false,
    color = "blue",
    textColor = "black",
    disabled,
    onClick,
    value
  } = props;

  const [keyPressed = false, setKeyPressed] = useState();
  const { add, reset, remove } = useCalculator();

  const handleClick = useCallback(() => {
    if (disabled) {
      return;
    }
    if (onClick) {
      onClick(value);
    } else if (clear) {
      reset();
    } else if (del) {
      remove();
    } else {
      add(value);
    }
  }, [clear, value, onClick, reset, add, remove, del, disabled]);

  useEffect(() => {
    if (disabled) {
      return;
    }
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
  }, [clear, del, value, handleClick, disabled]);

  useEffect(() => {
    if (!keyPressed) {
      return;
    }
    const timeout = setTimeout(() => setKeyPressed(false), 150);
    return () => clearTimeout(timeout);
  }, [keyPressed]);

  const bgColor = getBackgroundColor(color, keyPressed ? 700 : 500);
  const bgColorFocus = disabled ? bgColor : getBackgroundColor(color, 600);
  const bgColorActive = getBackgroundColor(color, 700);
  const txtColor = getTextColor(textColor, 500);
  const isSmall = small ? "px-2 text-xs" : "px-4 py-2";
  const isDisabled = disabled ? "opacity-25 pointer-events-none" : "";

  const classes = `w-full ${bgColor} focus:outline-none focus:${bgColorFocus} hover:${bgColorFocus} active:${bgColorActive} rounded font-bold ${txtColor} ${isSmall} ${isDisabled}`.trimRight();

  return (
    <button
      className={classes}
      type="button"
      aria-label={value}
      onClick={handleClick}
    >
      {value === "DEL" ? <Icon icon={faBackspace} /> : value}
    </button>
  );
}

const MemorizedCalculatorButton = React.memo(CalculatorButton);

/**
 * Calculator for purchase section
 */
function Calculator(props) {
  const { onSubmit } = props;
  const { value, reset } = useCalculator();

  const onClick = btnValue => {
    if (onSubmit) {
      onSubmit(btnValue, value);
      reset();
    }
  };

  return (
    <>
      <CalculatorDisplay value={value} />
      <div className="flex mb-2">
        <div className="w-1/5 pr-1">
          <MemorizedCalculatorButton
            color="green"
            value={PurchaseCategories.GiroTransfer}
            onClick={onClick}
            disabled={!onSubmit}
            small
          />
        </div>
        <div className="w-1/5 pr-1">
          <MemorizedCalculatorButton
            color="green"
            value={PurchaseCategories.CashPayment}
            onClick={onClick}
            disabled={!onSubmit}
            small
          />
        </div>
        <div className="w-1/5 pr-1">
          <MemorizedCalculatorButton
            color="green"
            value={PurchaseCategories.Deposit}
            onClick={onClick}
            disabled={!onSubmit}
            small
          />
        </div>
        <div className="w-1/5 pr-1">
          <MemorizedCalculatorButton
            value={PurchaseCategories.ReducedVAT}
            onClick={onClick}
            disabled={!onSubmit}
            small
          />
        </div>
        <div className="w-1/5">
          <MemorizedCalculatorButton
            value={PurchaseCategories.VAT}
            onClick={onClick}
            disabled={!onSubmit}
            small
          />
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="w-1/4 pr-1 pb-1">
          <MemorizedCalculatorButton color="gray" value="7" />
        </div>
        <div className="w-1/4 pr-1 pb-1">
          <MemorizedCalculatorButton color="gray" value="8" />
        </div>
        <div className="w-1/4 pr-1 pb-1">
          <MemorizedCalculatorButton color="gray" value="9" />
        </div>
        <div className="w-1/4">
          <MemorizedCalculatorButton color="orange" value="C" clear />
        </div>
        <div className="w-1/4 pr-1 pb-1">
          <MemorizedCalculatorButton color="gray" value="4" />
        </div>
        <div className="w-1/4 pr-1 pb-1">
          <MemorizedCalculatorButton color="gray" value="5" />
        </div>
        <div className="w-1/4 pr-1 pb-1">
          <MemorizedCalculatorButton color="gray" value="6" />
        </div>
        <div className="w-1/4">
          <MemorizedCalculatorButton color="orange" value="DEL" del />
        </div>
        <div className="w-1/4 pr-1 pb-1">
          <MemorizedCalculatorButton color="gray" value="1" />
        </div>
        <div className="w-1/4 pr-1">
          <MemorizedCalculatorButton color="gray" value="2" />
        </div>
        <div className="w-1/4 pr-1">
          <MemorizedCalculatorButton color="gray" value="3" />
        </div>
        <div className="w-1/2 pr-1">
          <MemorizedCalculatorButton color="gray" value="0" />
        </div>
        <div className="w-1/4 pr-1">
          <MemorizedCalculatorButton color="gray" value="," />
        </div>
      </div>
    </>
  );
}

Calculator.propTypes = {
  /** Handler for submitted values */
  onSubmit: PropTypes.func
};

export default Calculator;
