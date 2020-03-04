import React, { createContext, useContext } from "react";
import { useAuth0 } from "./auth";
import { useAlert } from "./components/common";

const ApiContext = createContext();
const useApi = () => useContext(ApiContext);

function ApiProvider(props) {
  const { children } = props;
  const { getTokenSilently } = useAuth0();
  const { showAlert } = useAlert();

  const get = async (route, setState) => {
    try {
      const token = await getTokenSilently();

      const res = await fetch(route, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { data } = await res.json();
      setState(data);
    } catch (err) {
      console.error(err);
      showAlert(err.message); // TODO: Add better error message
    }
  };

  const post = async (route, data, callback) => {
    try {
      const token = await getTokenSilently();

      const res = await fetch(route, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        callback();
      } else {
        throw new Error(res.statusText);
      }
    } catch (err) {
      console.error(err);
      showAlert(err.message); // TODO: Add better error message
    }
  };

  const value = {
    getLastActiveUsers: setState => get("/api/users/lastactive", setState),
    getDoorCodes: setState => get("/api/settings/doorcode", setState),
    getUserData: (email, setState) => get(`/api/users/${email}`, setState),
    getTransactionTypes: setState => get("/api/transactions/types", setState),
    getTransactionStates: setState => get("/api/transactions/states", setState),
    getTransactions: (id, setState) =>
      get(`/api/transactions/user/${id}`, setState),
    postTransactions: (data, callback) =>
      post("/api/transaction", data, callback),
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export { ApiProvider, useApi };
