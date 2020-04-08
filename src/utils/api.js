// @ts-check

import snakeCase from "lodash/snakeCase";

/**
 * Check if Response Body is JSON
 *
 * @param {Object} res
 * @returns {boolean}
 */
function isJSON(res) {
  const contentType = res.headers.get("content-type");
  if (contentType) {
    const isJSON = ["application/json", "application/vnd.api+json"].some(type =>
      contentType.includes(type)
    );
    return isJSON;
  }
  return false;
}

/**
 * Make Request
 *
 * @param {string} route API Route
 * @param {string} [token] Auth Token
 * @param {string} [method=GET] Request Method
 * @param {Object|Array} [body=undefined] Body of Request
 * @returns {Promise<any>}
 */
async function request(route, token, method = "GET", body = undefined) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  if (body) {
    headers["Content-Type"] = "application/json;charset=utf-8";
  }
  let error;
  let res;
  try {
    res = await fetch(route, { method, headers, body: JSON.stringify(body) });
    if (res.status !== 200) {
      if (isJSON(res)) {
        const { text } = await res.json();
        text && (error = new Error(text));
      } else {
        error = new Error(res.statusText);
      }
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
 * Get API Status
 *
 * @returns {Promise<("ok"|Error)>}
 */
export async function getStatus() {
  const res = await request("/api/status");
  if (res.status === 200) {
    return "ok";
  }
}

/**
 * Get Entries
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
  const res = await request(`/api/${entryType}${query}`, token);
  const entries = await res.json();
  return entries;
}

/**
 * Get Entry by Identifier
 *
 * @param {string|number} identifier entry Identifier
 * @param {string} entryType entry Type
 * @param {string} token Auth Token
 * @returns {Promise<(Object|Error)>}
 */
export async function getEntryBy(identifier, entryType, token) {
  const res = await request(`/api/${entryType}/${identifier}`, token);
  const entry = await res.json();
  return entry;
}

/**
 * Add Entry
 *
 * @param {Object|Array} data Body Data
 * @param {*} entryType Type of Entry
 * @param {*} token Auth Token
 * @returns {Promise<(Object|Error)>}
 */
export async function addEntry(data, entryType, token) {
  const res = await request(`/api/${entryType}`, token, "POST", data);
  const result = res.json();
  return result;
}

/**
 * Update Entry
 *
 * @param {string|string} identifier Row identifier
 * @param {Object|Array} data Body Data
 * @param {*} entryType Type of Entry
 * @param {*} token Auth Token
 * @returns {Promise<(Object|Error)>}
 */
export async function updateEntry(identifier, data, entryType, token) {
  const res = await request(
    `/api/${entryType}/${identifier}`,
    token,
    "PATCH",
    data
  );
  const result = res.json();
  return result;
}

/**
 * Get States
 *
 * @param {string} type Type of States
 * @param {string} token Auth Token
 * @returns {Promise<(Array<String>|Error)>}
 */
export async function getStates(type, token) {
  const res = await request(`/api/states/${type}`, token);
  const states = await res.json();
  return states;
}

/**
 * Get Types
 *
 * @param {string} type Type of Types
 * @param {string} token Auth Token
 * @returns {Promise<(Array<String>|Error)>}
 */
export async function getTypes(type, token) {
  const res = await request(`/api/types/${type}`, token);
  const types = await res.json();
  return types;
}
