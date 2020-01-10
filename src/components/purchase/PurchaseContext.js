import React, { createContext, useReducer, useContext } from "react";
import { PurchaseCategories } from "./consts";
import { fromCurrency } from "../../utils/numbers";
import useAsyncError from "../../hooks/useAsyncError";

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
      const val = parseFloat(value.replace(",", "."));
      return {
        ...state,
        [category]: {
          entries: [...state[category].entries, val],
          sum: state[category].sum + val
        }
      };
    }
    case "REMOVE": {
      if (state[category] === undefined) {
        return { ...state };
      }
      const val = state[category].entries[index];
      return {
        ...state,
        [category]: {
          entries: [
            ...state[category].entries.slice(0, index),
            ...state[category].entries.slice(index + 1)
          ],
          sum: state[category].sum - val
        }
      };
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
    const sum = entries.reduce((num, entry) => (num += entry), 0);
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
  const throwError = useAsyncError();
  const add = (category, value) => {
    if (category === PurchaseCategories.CashPayment) {
      const valid = fromCurrency(value) % 5 === 0;
      if (!valid) {
        throwError(
          new Error("Bitte bei Barzahlung nur mit Scheinen bezahlen. Danke!")
        );
      }
    }
    dispatch({ type: "ADD", category, value });
  };
  const remove = (category, index) =>
    dispatch({ type: "REMOVE", category, index });
  const value = { state, add, remove };
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
  const { add, remove } = context;

  return { state, add, remove };
}

export { PurchaseProvider, usePurchase };
