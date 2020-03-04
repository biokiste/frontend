import React, { useState, useEffect } from "react";
import { PurchaseContainer } from "../components/purchase";
import { TransactionList } from "../components/transaction";
import { useAuth0 } from "../auth";
import { useApi } from "../api";
import { useAlert } from "../components/common/Alert";

function Purchase() {
  const { user } = useAuth0();
  const {
    getTransactionTypes,
    getTransactionStates,
    getTransactions,
    getUserData,
    postTransactions,
  } = useApi();
  const [userData, setUserData] = useState();
  const [categories, setCategories] = useState([]);
  const [states, setStates] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const { showAlert } = useAlert();

  useEffect(() => {
    getTransactionTypes(setCategories);
    getTransactionStates(setStates);
  }, []); // eslint-disable-line

  useEffect(() => {
    if (user) {
      getUserData(user.email, setUserData);
    }
  }, [user]); // eslint-disable-line

  useEffect(() => {
    if (userData) {
      getTransactions(userData.id, data => {
        if (data.transactions !== null) {
          setTransactions(data.transactions);
          setBalance(data.balance);
        }
      });
    }
  }, [userData]); // eslint-disable-line

  useEffect(() => {
    const value = transactions.reduce((sum, cur) => sum + cur.amount, 0);
    setBalance(value);
  }, [transactions]);

  const onSubmit = item => {
    const { id: status } = states.find(state => state.type === "open");
    const { id: user_id, firstname, lastname } = userData;
    const created_at = new Date()
      .toISOString()
      .replace("T", " ")
      .slice(0, -5);
    const data = [];
    categories.forEach(category => {
      const { id: category_id, type } = category;
      if (item[type]) {
        const amount = item[type].reduce((sum, cur) => sum + cur, 0);
        data.push({
          created_at,
          user_id,
          firstname,
          lastname,
          category_id,
          status,
          amount,
          reason: "",
        });
      }
    });
    postTransactions({ user: userData, transactions: data }, err => {
      if (err) {
        showAlert(err.message); // TODO: Add better error message
      } else {
        setTransactions([...transactions, ...data]);
      }
    });
  };

  return (
    <>
      <PurchaseContainer
        onSubmit={onSubmit}
        balance={balance}
        categories={categories}
      />
      <TransactionList categories={categories} transactions={transactions} />
    </>
  );
}

export default Purchase;
