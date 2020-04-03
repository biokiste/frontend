import { getColumnVisibility, getColumnWidth } from "../utils/tailwind";
import {
  getStatus,
  getUserStates,
  getTransactionStates,
  getLoanStates,
  getTransactionTypes,
  getUsers,
} from "../utils/api";

describe("utils.api", () => {
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
    const states = ["state1", "state2", "state3"];
    const token = "Token";

    fetch.mockResponse(req => {
      const authorization = req.headers.get("Authorization");
      if (authorization !== `Bearer ${token}`) {
        return Promise.resolve({ status: 401, statusText: "Unauthorized" });
      }
      return Promise.resolve(JSON.stringify(states));
    });

    let error;
    try {
      await getUserStates();
    } catch (err) {
      error = err;
    }
    expect(error).toEqual(new Error("Unauthorized"));
    const userStates = await getUserStates(token);
    expect(userStates).toEqual(expect.arrayContaining(states));

    try {
      await getTransactionStates();
    } catch (err) {
      error = err;
    }
    expect(error).toEqual(new Error("Unauthorized"));
    const transactionStates = await getTransactionStates(token);
    expect(transactionStates).toEqual(expect.arrayContaining(states));

    try {
      await getLoanStates();
    } catch (err) {
      error = err;
    }
    expect(error).toEqual(new Error("Unauthorized"));
    const loanStates = await getLoanStates(token);
    expect(loanStates).toEqual(expect.arrayContaining(states));
  });
  test("get types", async () => {
    const types = ["type1", "type2", "type3"];
    const token = "Token";

    fetch.mockResponse(req => {
      const authorization = req.headers.get("Authorization");
      if (authorization !== `Bearer ${token}`) {
        return Promise.resolve({ status: 401, statusText: "Unauthorized" });
      }
      return Promise.resolve(JSON.stringify(types));
    });

    let error;
    try {
      await getTransactionTypes();
    } catch (err) {
      error = err;
    }
    expect(error).toEqual(new Error("Unauthorized"));
    const transactionTypes = await getTransactionTypes(token);
    expect(transactionTypes).toEqual(expect.arrayContaining(types));
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
    expect(users).toEqual(expect.arrayContaining(users));
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
