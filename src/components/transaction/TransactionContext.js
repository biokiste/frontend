import React, { createContext, useContext, useReducer } from "react";

const TransactionContext = createContext();

function transactionReducer(state, action) {
  const { type, transaction } = action;
  switch (type) {
    case "ADD":
      return state.concat([transaction]);
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
}

function TransactionProvider(props) {
  const { children, initialState: defaultState } = props;
  const [state, dispatch] = useReducer(transactionReducer, defaultState || []);
  const add = (transaction) => {
    dispatch({ type: "ADD", transaction });
  }
  const value = {
    transactions: state,
    add,
  }
  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>
}

function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  const { transactions, add } = context;
  return { transactions, add };
}

export { TransactionProvider, useTransactions };