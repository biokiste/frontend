// @ts-check

import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const OptionsContext = createContext({});

/**
 * Extract option name and key from route
 *
 * @param {string} route
 * @returns {Array<string>}
 */
function getNameAndKeyFromRoute(route) {
  const parts = route.split("/");
  return parts.slice(-2);
}

/**
 * @typedef {Object} Option
 * @property {string} name
 * @property {string} key
 * @property {string} data
 */

/**
 * Get option by route
 *
 * @param {String} route
 * @returns {Promise<Option>}
 */
async function getOption(route) {
  const [name, key] = getNameAndKeyFromRoute(route);
  const res = await fetch(route);
  const data = await res.json();
  return { name, key, data };
}

function OptionsProvider(props) {
  const [options, setOptions] = useState({});
  const { children, routes, basePath } = props;

  useEffect(() => {
    async function getStates() {
      try {
        const results = await Promise.all(
          routes.map(route => getOption(basePath + route))
        );
        const state = results.reduce((obj, result) => {
          obj[result.name] === undefined && (obj[result.name] = {});
          obj[result.name][result.key] = result.data;
          return obj;
        }, {});
        setOptions(state);
      } catch (err) {
        console.error(err);
        const results = routes.map(getNameAndKeyFromRoute);
        const state = results.reduce((obj, result) => {
          obj[result.name] === undefined && (obj[result.name] = {});
          obj[result.name][result.key] = [];
          return obj;
        }, {});
        setOptions(state);
      }
    }
    getStates();
  }, [routes, basePath]);

  return (
    <OptionsContext.Provider value={options}>
      {children}
    </OptionsContext.Provider>
  );
}

OptionsProvider.propTypes = {
  /**
   * Children
   */
  children: PropTypes.element.isRequired,
  /**
   * Option Routes
   */
  routes: PropTypes.arrayOf(PropTypes.string).isRequired,
  /**
   * API base path
   */
  basePath: PropTypes.string,
};

OptionsProvider.defaultProps = {
  basePath: "",
};

export { OptionsContext, OptionsProvider };
