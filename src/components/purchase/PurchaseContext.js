import React, { createContext, useReducer, useContext } from "react";
import { fromCurrency } from "../../utils/numbers";
import {
  ApplicationErrors,
  PurchaseCategories,
  AlertSeverity
} from "../../consts";
import { useAlert } from "../common/Alert";
import { useTranslation } from "react-i18next";

const PurchaseContext = createContext();

const initialState = {
  [PurchaseCategories.ReducedVAT]: { entries: [], sum: 0 },
  [PurchaseCategories.VAT]: { entries: [], sum: 0 },
  [PurchaseCategories.Deposit]: { entries: [], sum: 0 },
  [PurchaseCategories.GiroTransfer]: { entries: [], sum: 0 },
  [PurchaseCategories.CashPayment]: { entries: [], sum: 0 }
};

const purchaseReducer = (state, action) => {
  const { type, category, value, index } = action;
  if (
    type !== "CLEAR" &&
    !Object.keys(PurchaseCategories).some(
      key => PurchaseCategories[key] === category
    )
  ) {
    throw new Error(`Unknown purchase category: ${category}`);
  }
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
        [category]: {
          entries: [
            ...state[category].entries,
            { value: val, createdAt: new Date() }
          ],
          sum: state[category].sum + val
        }
      };
    }
    case "REMOVE": {
      if (state[category] === undefined) {
        return { ...state };
      }
      const entry = state[category].entries[index];
      return {
        ...state,
        [category]: {
          entries: [
            ...state[category].entries.slice(0, index),
            ...state[category].entries.slice(index + 1)
          ],
          sum: state[category].sum - entry.value
        }
      };
    }
    case "CLEAR": {
      return initialState;
    }
    default: {
      throw new Error(`Unhandled action type: ${type}`);
    }
  }
};

function createInitialState(state) {
  if (!state) {
    return initialState;
  }
  const enhancedState = Object.keys(state).reduce((obj, category) => {
    const entries = state[category].entries;
    const sum = entries.reduce((num, entry) => (num += entry.value), 0);
    obj[category] = { entries, sum };
    return obj;
  }, {});
  const mergedState = { ...initialState, ...enhancedState };
  return mergedState;
}

function PurchaseProvider(props) {
  const { children, initialState: defaultState } = props;
  const [state, dispatch] = useReducer(
    purchaseReducer,
    createInitialState(defaultState)
  );
  const { showAlert } = useAlert();
  const { t } = useTranslation("errors");
  const add = (category, value) => {
    if (category === PurchaseCategories.CashPayment) {
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
