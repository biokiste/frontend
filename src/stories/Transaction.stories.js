import React from "react";
import { storiesOf } from "@storybook/react";
import TransactionList from "../components/transaction/TransactionList";
import { TransactionProvider } from "../components/transaction/TransactionContext";

storiesOf("Transaction|TransationList", module)
  .add("default", () => {
    return (
      <TransactionProvider>
        <TransactionList />
      </TransactionProvider>
    );
  })
  .add("with transactions", () => {
    const initialState = [
      { createdAt: new Date(), "7%": -20.01, "Pfand": 0.3, total: 230.29 },
      { createdAt: new Date(), "SEPA": 200, total: 250 },
      { createdAt: new Date(), "BAR": 50, total: 50 },
    ]
    return (
      <TransactionProvider initialState={initialState}>
        <TransactionList />
      </TransactionProvider>
    );
  })
