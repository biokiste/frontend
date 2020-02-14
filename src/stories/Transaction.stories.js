import React from "react";
import { storiesOf } from "@storybook/react";
import TransactionList from "../components/transaction/TransactionList";
import "../i18n";

const categories = [
  {
    id: 1,
    type: "payment",
  },
  {
    id: 2,
    type: "deposit",
  },
  {
    id: 3,
    type: "correction",
  },
  {
    id: 4,
    type: "percent19",
  },
  {
    id: 5,
    type: "percent7",
  },
  {
    id: 6,
    type: "paymentSepa",
  },
];

const data = {
  balance: 17.99,
  transactions: [
    {
      id: 5,
      amount: -11.64,
      created_at: "2019-06-05 15:50:39",
      status: 1,
      reason: "",
      category_id: 4,
      type: "percent19",
      validated_by: 0,
    },
    {
      id: 4,
      amount: -40.98,
      created_at: "2019-06-05 15:50:39",
      status: 1,
      reason: "",
      category_id: 5,
      type: "percent7",
      validated_by: 0,
    },
    {
      id: 3,
      amount: -19.93,
      created_at: "2018-10-17 16:36:03",
      status: 1,
      reason: "",
      category_id: 5,
      type: "percent7",
      validated_by: 0,
    },
    {
      id: 2,
      amount: 100,
      created_at: "2018-10-17 16:34:59",
      status: 1,
      reason: "",
      category_id: 6,
      type: "paymentSepa",
      validated_by: 0,
    },
    {
      id: 1,
      amount: -9.46,
      created_at: "2018-05-30 09:56:14",
      status: 1,
      reason: "",
      category_id: 4,
      type: "percent19",
      validated_by: 0,
    },
  ],
};

storiesOf("Transaction|TransactionList", module).add(
  "with transactions",
  () => {
    return (
      <div className="container mx-auto p-2 flex flex-row flex-wrap">
        <TransactionList
          balance={data.balance}
          transactions={data.transactions}
          categories={categories}
        />
      </div>
    );
  }
);
