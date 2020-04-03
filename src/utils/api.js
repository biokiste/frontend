// @ts-check

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
 * Get Users
 *
 * @param {string} token Auth Token
 * @returns {Promise<(Array<Object>|Error)>}
 */
export async function getUsers(token) {
  const res = await get("/api/users", token);
  const users = await res.json();
  return users;
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
 * Get Transactions
 *
 * @param {string} token Auth Token
 * @param {Object} [params] Query parameters
 * @returns {Promise<(Array<Object>|Error)>}
 */
export async function getTransactions(token, params) {
  const route = "/api/transactions";
  const query = params
    ? Object.keys(params).reduce((str, key) => {
        const k =
          key === "createdAt"
            ? "created_at"
            : key === "userId"
            ? "user_id"
            : key;
        return `${str}${k}=${params[key]}`;
      }, "?")
    : "";
  const res = await get(`${route}${query}`, token);
  const transactions = await res.json();
  return transactions;
}

/**
 * Get Loans
 *
 * @param {string} token Auth Token
 * @param {Object} [params] Query parameters
 * @returns {Promise<(Array<Object>|Error)>}
 */
export async function getLoans(token, params) {
  const route = "/api/loans";
  const query = params
    ? Object.keys(params).reduce((str, key) => {
        const k = key === "userId" ? "user_id" : key;
        return `${str}${k}=${params[key]}`;
      }, "?")
    : "";
  const res = await get(`${route}${query}`, token);
  const loans = await res.json();
  return loans;
}

/**
 * Get Groups
 *
 * @param {string} token Auth Token
 * @returns {Promise<(Array<Object>|Error)>}
 */
export async function getGroups(token) {
  const res = await get("/api/groups", token);
  const groups = await res.json();
  return groups;
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
 * Get Settings
 *
 * @param {string} token Auth Token
 * @returns {Promise<(Array<Object>|Error)>}
 */
export async function getSettings(token) {
  const res = await get("/api/settings", token);
  const settings = await res.json();
  return settings;
}
