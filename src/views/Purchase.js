import React, { useState, useEffect } from "react";
import PurchaseContainer from "../components/purchase/PurchaseContainer";
import TransactionList from "../components/transaction/TransactionList";
import { PurchaseCategories } from "../consts";
import { useAlert } from "../components/common/Alert";

function getCategoryName(type) {
  switch (type) {
    case "payment":
      return PurchaseCategories.CashPayment;
    case "deposit":
      return PurchaseCategories.Deposit;
    case "percent19":
      return PurchaseCategories.VAT;
    case "percent7":
      return PurchaseCategories.ReducedVAT;
    case "paymentSepa":
      return PurchaseCategories.GiroTransfer;
    default:
      return undefined;
  }
}

function useCategories() {
  const [categories, setCategories] = useState([]);
  const { showAlert } = useAlert();
  useEffect(() => {
    async function getCategories() {
      try {
        const header = new Headers();
        header.append("Authorization", `Bearer ${process.env.TOKEN}`);
        const options = {
          method: "GET",
          headers: header,
          redirect: "follow"
        };
        const res = await fetch("/api/transactions/types", options);
        const { data } = await res.json();
        const categories = data
          .map(({ id, type }) => {
            const name = getCategoryName(type);
            return {
              id,
              name,
              type: "Number"
            };
          })
          .filter(category => !!category.name);
        setCategories([
          { name: "createdAt", type: "Date" },
          ...categories,
          { name: "total", type: "Number" }
        ]);
      } catch (err) {
        showAlert(err.message);
      }
    }
    getCategories();
  }, []); // eslint-disable-line
  return categories;
}

function getNewBalance(balance, item) {
  return (
    balance +
    Object.keys(item).reduce((sum, category) => {
      if (
        [
          PurchaseCategories.CashPayment,
          PurchaseCategories.GiroTransfer,
          PurchaseCategories.Deposit
        ].some(cat => cat === category)
      ) {
        sum += item[category].sum;
      } else {
        sum -= item[category].sum;
      }
      return sum;
    }, 0)
  );
}

function Purchase() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const categories = useCategories();

  const onSubmit = item => {
    const newBalance = getNewBalance(balance, item);
    setTransactions(
      transactions.concat([
        {
          ...Object.keys(item).reduce(
            (obj, category) => ({ ...obj, [category]: item[category].sum }),
            {}
          ),
          createdAt: new Date(),
          total: newBalance
        }
      ])
    );
    setBalance(newBalance);
  };
  return (
    <>
      <PurchaseContainer onSubmit={onSubmit} accountBalance={balance} />
      <TransactionList categories={categories} transactions={transactions} />
    </>
  );
}

export default Purchase;
