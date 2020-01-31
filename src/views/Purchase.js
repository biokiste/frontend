import React, { useState } from "react";
import PurchaseContainer from "../components/purchase/PurchaseContainer";
import TransactionList from "../components/transaction/TransactionList";
import { PurchaseCategories } from "../consts";

function getNewBalance(balance, item) {
  return balance + Object.keys(item).reduce((sum, category) => {
    if ([PurchaseCategories.CashPayment, PurchaseCategories.GiroTransfer, PurchaseCategories.Deposit].some(cat => cat === category)) {
      sum += item[category].sum;
    } else {
      sum -= item[category].sum;
    }
    return sum;
  }, 0);
}

function Purchase() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const onSubmit = item => {
    const newBalance = getNewBalance(balance, item);
    setTransactions(transactions.concat([{ ...Object.keys(item).reduce((obj, category) => ({ ...obj, [category]: item[category].sum }), {}), createdAt: new Date(), total: newBalance }]));
    setBalance(newBalance);
  }
  return (
    <>
      <PurchaseContainer onSubmit={onSubmit} accountBalance={balance} />
      <TransactionList transactions={transactions} />
    </>
  );
}

export default Purchase;