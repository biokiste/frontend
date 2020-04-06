// @ts-check

import snakeCase from "lodash/snakeCase";

/**
 *  Make GET request
 *
 * @param {string} route Api route
 * @param {string} [token] Auth Token
 * @returns {Promise<any>}
 */
async function get(route, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  let error;
  let res;
  try {
    res = await fetch(route, { headers });
    if (res.status !== 200) {
      error = new Error(res.statusText);
    }
  } catch (err) {
    error = err;
  } finally {
    if (error) {
      throw error;
    } else {
      return res;
    }
  }
}

/**
 * Get API status
 *
 * @returns {Promise<("ok"|Error)>}
 */
export async function getStatus() {
  const res = await get("/api/status");
  if (res.status === 200) {
    return "ok";
  }
}

/**
 * Get entries
 *
 * @param {string} entryType Type of Entries
 * @param {string} token Auth Token
 * @param {Object} [params] Query parameters
 * @returns {Promise<(Array<Object>|Error)>}
 */
export async function getEntries(entryType, token, params) {
  const query = params
    ? Object.keys(params).reduce((str, key) => {
        const k = snakeCase(key);
        return `${str}${k}=${params[key]}`;
      }, "?")
    : "";
  const res = await get(`/api/${entryType}${query}`, token);
  const entries = await res.json();
  return entries;
}

/**
 * Get states
 *
 * @param {string} type Type of States
 * @param {string} token Auth Token
 * @returns {Promise<(Array<String>|Error)>}
 */
export async function getStates(type, token) {
  const res = await get(`/api/states/${type}`, token);
  const states = await res.json();
  return states;
}

/**
 * Get types
 *
 * @param {string} type Type of Types
 * @param {string} token Auth Token
 * @returns {Promise<(Array<String>|Error)>}
 */
export async function getTypes(type, token) {
  const res = await get(`/api/types/${type}`, token);
  const types = await res.json();
  return types;
}

/**
 * Get Entry by Identifier
 *
 * @param {string|number} identifier entry Identifier
 * @param {string} entryType entry Type
 * @param {string} token Auth Token
 */
export async function getEntryBy(identifier, entryType, token) {
  const res = await get(`/api/${entryType}/${identifier}`, token);
  const entry = await res.json();
  return entry;
}
