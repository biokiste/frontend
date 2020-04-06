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
 * Get all entries
 *
 * @param {string} entryType Type of Entries
 * @param {string} token Auth Token
 * @param {Object} [params] Query parameters
 * @returns {Promise<(Array<Object>|Error)>}
 */
export async function getAllEntries(entryType, token, params) {
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
 * Get User states
 *
 * @param {string} token Auth Token
 * @returns {Promise<(Array<String>|Error)>}
 */
export async function getUserStates(token) {
  const res = await get("/api/states/user", token);
  const states = await res.json();
  return states;
}

/**
 * Get Transaction states
 *
 * @param {string} token Auth Token
 * @returns {Promise<(Array<String>|Error)>}
 */
export async function getTransactionStates(token) {
  const res = await get("/api/states/transaction", token);
  const states = await res.json();
  return states;
}

/**
 * Get Loan states
 *
 * @param {string} token Auth Token
 * @returns {Promise<(Array<String>|Error)>}
 */
export async function getLoanStates(token) {
  const res = await get("/api/states/loan", token);
  const states = await res.json();
  return states;
}

/**
 * Get Transaction types
 *
 * @param {string} token Auth Token
 * @returns {Promise<(Array<String>|Error)>}
 */
export async function getTransactionTypes(token) {
  const res = await get("/api/types/transaction", token);
  const types = await res.json();
  return types;
}

/**
 * Get User by Id
 *
 * @param {number} id User id
 * @param {string} token Auth Token
 * @returns {Promise<(Object|Error)>}
 */
export async function getUserById(id, token) {
  const res = await get(`/api/users/${id}`, token);
  const user = await res.json();
  return user;
}

/**
 * Get Group by Id
 *
 * @param {number} id Group id
 * @param {string} token Auth Token
 * @returns {Promise<(Object|Error)>}
 */
export async function getGroupById(id, token) {
  const res = await get(`/api/groups/${id}`, token);
  const group = await res.json();
  return group;
}

/**
 * Get Setting by Key
 *
 * @param {string} key Setting Key
 * @param {string} token Auth Token
 * @returns {Promise<(Object|Error)>}
 */
export async function getSettingByKey(key, token) {
  const res = await get(`/api/settings/${key}`, token);
  const setting = await res.json();
  return setting;
}
