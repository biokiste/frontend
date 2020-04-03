import URL from "url";
import moment from "moment";
import { isAuthorized, Token } from "./utils";
import { getTransactions } from "../../utils/api";

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
  let transactions = await getTransactions(Token);
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
  transactions = await getTransactions(Token, { type: "type1" });
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
  transactions = await getTransactions(Token, { state: "state1" });
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
  transactions = await getTransactions(Token, { userId: 2 });
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
  transactions = await getTransactions(Token, { createdAt: "2016-01-03" });
  expect(transactions).toEqual(expect.arrayContaining([res[1], res[2]]));
});
