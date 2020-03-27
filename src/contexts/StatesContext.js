import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const StatesContext = createContext();

function getKeyFromRoute(route) {
  const parts = route.split("/");
  const key = parts[parts.length - 1];
  return key;
}

async function getState(route) {
  const key = getKeyFromRoute(route);
  const res = await fetch(route);
  const data = await res.json();
  return { key, data };
}

function StatesProvider(props) {
  const [states, setStates] = useState({});
  const { children, routes } = props;

  useEffect(() => {
    async function getStates() {
      try {
        const results = await Promise.all(routes.map(route => getState(route)));
        setStates(
          results.reduce(
            (obj, result) => ({ ...obj, [result.key]: result.data }),
            {}
          )
        );
      } catch (err) {
        console.error(err);
        const keys = routes.map(getKeyFromRoute);
        setStates(keys.reduce((obj, key) => ({ ...obj, [key]: [] }), []));
      }
    }
    getStates();
  }, [routes]);

  return (
    <StatesContext.Provider value={states}>{children}</StatesContext.Provider>
  );
}

StatesProvider.propTypes = {
  children: PropTypes.element.isRequired,
  routes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export { StatesContext, StatesProvider };
