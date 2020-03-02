import React, { createContext, useContext } from "react";
import { useAuth0 } from "./auth";

const ApiContext = createContext();
const useApi = () => useContext(ApiContext);

function ApiProvider(props) {
  const { children } = props;
  const { getTokenSilently } = useAuth0();

  const call = async (route, setState) => {
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
    }
  };

  const value = {
    getLastActiveUsers: setState => call("/api/users/lastactive", setState),
    getDoorCodes: setState => call("/api/settings/doorcode", setState),
    getUserData: (email, setState) => call(`/api/users/${email}`, setState),
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export { ApiProvider, useApi };