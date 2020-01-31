import React from "react";
import { storiesOf } from "@storybook/react";
import TransactionList from "../components/transaction/TransactionList";
import "../i18n";

storiesOf("Transaction|TransationList", module)
  .add("default", () => {
    return (
      <TransactionList />
    );
  })
  .add("with transactions", () => {
    const transactions = [
      {
        createdAt: new Date("2019-09-30"),
        reducedVat: -20.01,
        deposit: 0.3,
        total: 230.29
      },
      { createdAt: new Date("2019-05-17"), cash: 50, total: 50 },
      { createdAt: new Date("2019-09-05"), giro: 200, total: 250 }
    ];
    return (
      <div className="container mx-auto p-2 flex flex-row flex-wrap">
        <TransactionList transactions={transactions} />
      </div>
    );
  });
