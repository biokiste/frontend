// @ts-check

/**
 * Get API status
 *
 * @returns {Promise<("ok"|Error)>}
 */
export async function getStatus() {
  let error;
  try {
    const res = await fetch("/api/status");
    if (res.status !== 200) {
      error = new Error(res.statusText);
    }
  } catch (err) {
    error = err;
  } finally {
    if (error) {
      throw error;
    } else {
      return "ok";
    }
  }
}

/**
 * Get User states
 *
 * @param {string} token Auth Token
 * @returns {Promise<(Array<String>|Error)>}
 */
export async function getUserStates(token) {
  let error;
  let states;
  try {
    const res = await fetch("/api/states/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    states = res.json();
  } catch (err) {
    error = err;
  } finally {
    if (error) {
      throw error;
    }
    return states;
  }
}

/**
 * Get Transaction states
 *
 * @param {string} token Auth Token
 * @returns {Promise<(Array<String>|Error)>}
 */
export async function getTransactionStates(token) {
  let error;
  let states;
  try {
    const res = await fetch("/api/states/transaction", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    states = res.json();
  } catch (err) {
    error = err;
  } finally {
    if (error) {
      throw error;
    }
    return states;
  }
}

/**
 * Get Loan states
 *
 * @param {string} token Auth Token
 * @returns {Promise<(Array<String>|Error)>}
 */
export async function getLoanStates(token) {
  let error;
  let states;
  try {
    const res = await fetch("/api/states/loan", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    states = res.json();
  } catch (err) {
    error = err;
  } finally {
    if (error) {
      throw error;
    }
    return states;
  }
}

/**
 * Get Transaction types
 *
 * @param {string} token Auth Token
 * @returns {Promise<(Array<String>|Error)>}
 */
export async function getTransactionTypes(token) {
  let error;
  let states;
  try {
    const res = await fetch("/api/types/transaction", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    states = res.json();
  } catch (err) {
    error = err;
  } finally {
    if (error) {
      throw error;
    }
    return states;
  }
}
