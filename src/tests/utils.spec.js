import URL from "url";
import moment from "moment";
import { getColumnVisibility, getColumnWidth } from "../utils/tailwind";
import {
  getStatus,
  getUserStates,
  getTransactionStates,
  getLoanStates,
  getTransactionTypes,
  getUsers,
  getUserById,
  getTransactions,
} from "../utils/api";

describe("utils.api", () => {
  const token = "Token";

  function isAuthorized(req) {
    const authorization = req.headers.get("Authorization");
    return authorization === `Bearer ${token}`;
  }

  test("get api status", async () => {
    fetch.mockResponse(req =>
      Promise.resolve({ status: 400, statusText: "Bad Request" })
    );
    let error;
    try {
      await getStatus();
    } catch (err) {
      error = err;
    }
    expect(error).toEqual(new Error("Bad Request"));
    fetch.mockResponse("ok");
    const res = await getStatus();
    expect(res).toBe("ok");
  });
  test("get states", async () => {
    const res = ["state1", "state2", "state3"];

    fetch.mockResponse(req =>
      Promise.resolve(
        isAuthorized(req)
          ? JSON.stringify(res)
          : { status: 401, statusText: "Unauthorized" }
      )
    );

    let error;
    try {
      await getUserStates();
    } catch (err) {
      error = err;
    }
    expect(error).toEqual(new Error("Unauthorized"));
    const userStates = await getUserStates(token);
    expect(userStates).toEqual(expect.arrayContaining(res));

    try {
      await getTransactionStates();
    } catch (err) {
      error = err;
    }
    expect(error).toEqual(new Error("Unauthorized"));
    const transactionStates = await getTransactionStates(token);
    expect(transactionStates).toEqual(expect.arrayContaining(res));

    try {
      await getLoanStates();
    } catch (err) {
      error = err;
    }
    expect(error).toEqual(new Error("Unauthorized"));
    const loanStates = await getLoanStates(token);
    expect(loanStates).toEqual(expect.arrayContaining(res));
  });
  test("get types", async () => {
    const res = ["type1", "type2", "type3"];

    fetch.mockResponse(req =>
      Promise.resolve(
        isAuthorized(req)
          ? JSON.stringify(res)
          : { status: 401, statusText: "Unauthorized" }
      )
    );

    let error;
    try {
      await getTransactionTypes();
    } catch (err) {
      error = err;
    }
    expect(error).toEqual(new Error("Unauthorized"));
    const transactionTypes = await getTransactionTypes(token);
    expect(transactionTypes).toEqual(expect.arrayContaining(res));
  });
  test("get users", async () => {
    const token = "Token";
    const res = [
      { id: 1, firstName: "Test1", lastName: "Test1" },
      { id: 2, firstName: "Test2", lastName: "Test2" },
    ];

    fetch.mockResponse(req => {
      const authorization = req.headers.get("Authorization");
      if (authorization !== `Bearer ${token}`) {
        return Promise.resolve({ status: 401, statusText: "Unauthorized" });
      }
      return Promise.resolve(JSON.stringify(res));
    });

    let error;
    try {
      await getUsers();
    } catch (err) {
      error = err;
    }
    expect(error).toEqual(new Error("Unauthorized"));
    const users = await getUsers(token);
    expect(users).toEqual(expect.arrayContaining(res));
  });
  test("get user by id", async () => {
    const token = "Token";
    const res = [
      { id: 1, firstName: "Test1", lastName: "Test1" },
      { id: 2, firstName: "Test2", lastName: "Test2" },
    ];

    fetch.mockResponseOnce(req =>
      Promise.resolve(
        !isAuthorized(req) && { status: 401, statusText: "Unauthorized" }
      )
    );

    let error;
    try {
      await getUserById();
    } catch (err) {
      error = err;
    }
    expect(error).toEqual(new Error("Unauthorized"));

    fetch.mockResponse(req => {
      if (!isAuthorized(req)) {
        return Promise.resolve({ status: 401, statusText: "Unauthorized" });
      }
      const parts = req.url.split("/");
      const id = parts[parts.length - 1];
      const idx = res.findIndex(item => item.id === parseInt(id));
      return Promise.resolve(
        idx === -1
          ? { status: 404, statusText: "Not Found" }
          : JSON.stringify(res[idx])
      );
    });
    try {
      await getUserById(3, token);
    } catch (err) {
      error = err;
    }
    expect(error).toEqual(new Error("Not Found"));

    const user = await getUserById(1, token);
    expect(user).toEqual(res[0]);
  });
  test("get transactions", async () => {
    const res = [
      {
        id: 1,
        amount: 10,
        type: "type1",
        state: "state1",
        userId: 1,
        createdAt: "2016-01-02 15:04:05",
      },
      {
        id: 2,
        amount: 5,
        type: "type1",
        state: "state2",
        userId: 1,
        createdAt: "2016-01-03 15:04:05",
      },
      {
        id: 3,
        amount: 5,
        type: "type2",
        state: "state1",
        userId: 2,
        createdAt: "2016-01-03 15:04:05",
      },
    ];

    fetch.mockResponseOnce(req =>
      Promise.resolve(
        !isAuthorized(req) && { status: 401, statusText: "Unauthorized" }
      )
    );
    let error;
    try {
      await getTransactions();
    } catch (err) {
      error = err;
    }
    expect(error).toEqual(new Error("Unauthorized"));

    fetch.mockResponseOnce(req =>
      Promise.resolve(
        isAuthorized(req)
          ? JSON.stringify(res)
          : { status: 401, statusText: "Unauthorized" }
      )
    );
    let transactions = await getTransactions(token);
    expect(transactions).toEqual(expect.arrayContaining(res));

    fetch.mockResponseOnce(req => {
      if (!isAuthorized(req)) {
        return Promise.resolve({ status: 401, statusText: "Unauthorized" });
      }
      const url = URL.parse(req.url, true);
      return Promise.resolve(
        JSON.stringify(res.filter(item => item.type === url.query.type))
      );
    });
    transactions = await getTransactions(token, { type: "type1" });
    expect(transactions).toEqual(expect.arrayContaining([res[0], res[1]]));

    fetch.mockResponseOnce(req => {
      if (!isAuthorized(req)) {
        return Promise.resolve({ status: 401, statusText: "Unauthorized" });
      }
      const url = URL.parse(req.url, true);
      return Promise.resolve(
        JSON.stringify(res.filter(item => item.state === url.query.state))
      );
    });
    transactions = await getTransactions(token, { state: "state1" });
    expect(transactions).toEqual(expect.arrayContaining([res[0], res[2]]));

    fetch.mockResponseOnce(req => {
      if (!isAuthorized(req)) {
        return Promise.resolve({ status: 401, statusText: "Unauthorized" });
      }
      const url = URL.parse(req.url, true);
      return Promise.resolve(
        JSON.stringify(
          res.filter(item => item.userId === parseInt(url.query.user_id))
        )
      );
    });
    transactions = await getTransactions(token, { userId: 2 });
    expect(transactions).toEqual(expect.arrayContaining([res[2]]));

    fetch.mockResponseOnce(req => {
      if (!isAuthorized(req)) {
        return Promise.resolve({ status: 401, statusText: "Unauthorized" });
      }
      const url = URL.parse(req.url, true);
      return Promise.resolve(
        JSON.stringify(
          res.filter(item =>
            moment(item.createdAt).isSame(url.query.created_at, "day")
          )
        )
      );
    });
    transactions = await getTransactions(token, { createdAt: "2016-01-03" });
    expect(transactions).toEqual(expect.arrayContaining([res[1], res[2]]));
  });
});

describe("utils.tailwind", () => {
  describe("getColumnVisibility()", () => {
    it("returns empty string", () => {
      const columns = ["valueKey"];
      const value = getColumnVisibility(columns);
      expect(value).toBe("");
    });
    it("returns visibility breakpoints", () => {
      const columns = {
        visible: ["valueKey1"],
        sm: ["valueKey2"],
      };
      expect(getColumnVisibility(columns, "valueKey1")).toBe(`visible`);
      expect(getColumnVisibility(columns, "valueKey2")).toBe(
        `invisible sm:visible`
      );
    });
  });
  describe("getColumnWidth()", () => {
    it("returns width based on number of columns", () => {
      const columns = ["valueKey1", "valueKey2", "valueKey3"];
      const value = getColumnWidth(columns, "valueKey1");
      expect(value).toBe(`w-1/3`);
    });
    it("returns width based breakpoints", () => {
      const columns = {
        visible: ["valueKey1"],
        sm: ["valueKey2", "valueKey3"],
        md: ["valueKey4"],
      };
      expect(getColumnWidth(columns, "valueKey1")).toBe(
        `w-full sm:w-1/3 md:w-1/4`
      );
      expect(getColumnWidth(columns, "valueKey2")).toBe(
        `w-0 sm:w-1/3 md:w-1/4`
      );
      expect(getColumnWidth(columns, "valueKey4")).toBe(`w-0 md:w-1/4`);
      columns.visible = [...columns.visible, "valueKey5"];
      expect(getColumnWidth(columns, "valueKey1")).toBe(
        `w-1/2 sm:w-1/4 md:w-1/5`
      );
    });
  });
});
