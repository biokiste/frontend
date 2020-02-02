import React from "react";
import { storiesOf } from "@storybook/react";
import TransactionList from "../components/transaction/TransactionList";
import "../i18n";
import { PurchaseCategories } from "../consts";

storiesOf("Transaction|TransactionList", module)
  .add("default", () => {
    const categories = [
      { id: 0, name: "first", type: "Number" },
      { id: 1, name: "second", type: "Number" },
      { id: 2, name: "third", type: "Date" }
    ];
    return <TransactionList categories={categories} />;
  })
  .add("with transactions", () => {
    const categories = [
      {
        name: "createdAt",
        type: "Date"
      },
      {
        name: PurchaseCategories.CashPayment,
        type: "Number"
      },
      {
        name: PurchaseCategories.Deposit,
        type: "Number"
      },
      {
        name: PurchaseCategories.GiroTransfer,
        type: "Number"
      },
      {
        name: PurchaseCategories.ReducedVAT,
        type: "Number"
      },
      {
        name: PurchaseCategories.VAT,
        type: "Number"
      },
      {
        name: "total",
        type: "Number"
      }
    ];
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
        <TransactionList transactions={transactions} categories={categories} />
      </div>
    );
  });
