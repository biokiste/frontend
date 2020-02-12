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
          redirect: "follow",
        };
        const res = await fetch("/api/transactions/types", options);
        const { data } = await res.json();
        const categories = data
          .map(({ id, type }) => {
            const name = getCategoryName(type);
            return {
              id,
              name,
              type: "Number",
            };
          })
          .filter(category => !!category.name);
        setCategories([
          { name: "createdAt", type: "Date" },
          ...categories,
          { name: "total", type: "Number" },
        ]);
      } catch (err) {
        showAlert(err.message);
      }
    }
    getCategories();
  }, []); // eslint-disable-line
  return categories;
}

function parseData(data) {
  const { transactions } = data;
  let total = 0;
  return transactions
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map(({ amount, created_at, type }, idx) => {
      const category = getCategoryName(type);
      total += amount;
      [PurchaseCategories.VAT, PurchaseCategories.ReducedVAT].some(
        item => item === category
      ) && (amount *= -1);
      return {
        createdAt: new Date(created_at),
        [category]: amount,
        total,
      };
    });
}

function useUserTransactions() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const { showAlert } = useAlert();
  const categories = useCategories();
  useEffect(() => {
    async function getTransactions() {
      try {
        const header = new Headers();
        header.append("Authorization", `Bearer ${process.env.TOKEN}`);
        const options = {
          method: "GET",
          headers: header,
          redirect: "follow",
        };
        const res = await fetch(
          `/api/transactions/user/${process.env.USER_ID}`,
          options
        );
        const json = await res.json();

        setBalance(json.data.balance);
        setTransactions(parseData(json.data));
      } catch (err) {
        // TODO: Create application error
        showAlert(err.message);
        console.error(err);
      }
    }
    if (categories.length !== 0) {
      getTransactions();
    }
  }, [categories]); // eslint-disable-line

  const addTransaction = async transaction => {
    try {
      const { createdAt } = transaction;
      const items = [];
      Object.keys(transaction).forEach(key => {
        if (key === "createdAt" || key === "total") {
          return;
        }
        if (transaction[key] > 0) {
          const { id } = categories.find(category => category.name === key);

          items.push({
            category_id: id,
            status: 1,
            created_at: createdAt
              .toISOString()
              .slice(0, 19)
              .replace("T", " "),
            amount: [
              PurchaseCategories.VAT,
              PurchaseCategories.ReducedVAT,
            ].some(item => item === key)
              ? transaction[key] * -1
              : transaction[key],
          });
        }
      });
      const header = new Headers();
      header.append("Authorization", `Bearer ${process.env.TOKEN}`);
      header.append("Accept", "application/json");
      header.append("Content-Type", "application/json");
      const options = {
        method: "POST",
        headers: header,
        redirect: "follow",
      };
      const res = await fetch("/api/transaction", {
        ...options,
        body: JSON.stringify({
          user: { id: parseInt(process.env.USER_ID) },
          transactions: items,
        }),
      });
      const { data } = await res.json();
      setBalance(data.balance);
      setTransactions(transactions.concat([transaction]));
    } catch (err) {
      // TODO: Create application error
      showAlert(err.message);
      console.error(err);
    }
  };

  return { balance, transactions, addTransaction };
}

function getNewBalance(balance, item) {
  return (
    balance +
    Object.keys(item).reduce((sum, category) => {
      if (
        [
          PurchaseCategories.CashPayment,
          PurchaseCategories.GiroTransfer,
          PurchaseCategories.Deposit,
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
  const { balance, transactions, addTransaction } = useUserTransactions();
  const categories = useCategories();

  const onSubmit = item => {
    const newBalance = getNewBalance(balance, item);
    const transaction = {
      ...Object.keys(item).reduce(
        (obj, category) => ({ ...obj, [category]: item[category].sum }),
        {}
      ),
      createdAt: Object.keys(item).reduce((date, category) => {
        const entries = item[category].entries
          .map(elem => elem.createdAt)
          .filter(createdAt => !!createdAt);
        if (entries.length === 0) {
          return date;
        }
        const latest = Math.max(...entries);
        if (date) {
          return new Date(Math.max(date, latest));
        }
        return new Date(latest);
      }, 0),
      total: newBalance,
    };
    addTransaction(transaction);
  };

  return (
    <>
      <PurchaseContainer onSubmit={onSubmit} accountBalance={balance} />
      <TransactionList categories={categories} transactions={transactions} />
    </>
  );
}

export default Purchase;
