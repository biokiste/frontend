import React, { createContext, useReducer, useContext } from "react";
import { fromCurrency } from "../../utils/numbers";
import { ApplicationErrors, AlertSeverity } from "../../consts";
import { useAlert } from "../common/Alert";
import { useTranslation } from "react-i18next";

const PurchaseContext = createContext();

const purchaseReducer = (state, action) => {
  const { type, category, value, index } = action;
  switch (type) {
    case "ADD": {
      if (state[category] === undefined) {
        state[category] = [];
      }
      if (value === "0") {
        return state;
      }
      const val = parseFloat(value.replace(",", "."));
      return {
        ...state,
        [category]: [...state[category], val],
      };
    }
    case "REMOVE": {
      if (state[category] === undefined) {
        return { ...state };
      }
      return {
        ...state,
        [category]: [
          ...state[category].slice(0, index),
          ...state[category].slice(index + 1),
        ],
      };
    }
    case "CLEAR": {
      return {};
    }
    default: {
      throw new Error(`Unhandled action type: ${type}`);
    }
  }
};

function PurchaseProvider(props) {
  const { children } = props;
  const [state, dispatch] = useReducer(purchaseReducer, {});
  const { showAlert } = useAlert();
  const { t } = useTranslation("errors");

  const add = (category, value) => {
    if (category === "payment") {
      const valid = fromCurrency(value) % 5 === 0;
      if (!valid) {
        showAlert(t(ApplicationErrors.WrongCashPayment), AlertSeverity.Error);
        return;
      }
    }
    dispatch({ type: "ADD", category, value });
  };
  const remove = (category, index) =>
    dispatch({ type: "REMOVE", category, index });
  const clear = () => {
    dispatch({ type: "CLEAR" });
  };
  const value = { state, add, remove, clear };
  return (
    <PurchaseContext.Provider value={value}>
      {children}
    </PurchaseContext.Provider>
  );
}

function usePurchase(category) {
  const context = useContext(PurchaseContext);
  if (context === undefined) {
    throw new Error("usePurchase must be used within a PurchaseProvider");
  }
  const state =
    category === undefined ? context.state : context.state[category];
  const { add, remove, clear } = context;

  return { state, add, remove, clear };
}

export { PurchaseProvider, usePurchase };
