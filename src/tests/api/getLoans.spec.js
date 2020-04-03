import URL from "url";
import { isAuthorized, Token } from "./utils";
import { getLoans } from "../../utils/api";

test("get loans", async () => {
  const res = [
    {
      id: 1,
      state: "state1",
      userId: 1,
    },
    {
      id: 2,
      state: "state2",
      userId: 1,
    },
    {
      id: 3,
      state: "state1",
      userId: 2,
    },
  ];

  fetch.mockResponse(req => {
    if (!isAuthorized(req)) {
      return Promise.resolve({ status: 401, statusText: "Unauthorized" });
    }
    const url = URL.parse(req.url, true);
    return Promise.resolve(
      JSON.stringify(
        res.filter(item => {
          if (url.query.state) {
            return item.state === url.query.state;
          }
          if (url.query.user_id) {
            return item.userId === parseInt(url.query.user_id);
          }
          return true;
        })
      )
    );
  });

  let error;
  try {
    await getLoans();
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Unauthorized"));

  let loans = await getLoans(Token);
  expect(loans).toEqual(expect.arrayContaining(res));

  loans = await getLoans(Token, { state: "state1" });
  expect(loans).toEqual(expect.arrayContaining([res[0], res[2]]));

  loans = await getLoans(Token, { userId: 1 });
  expect(loans).toEqual(expect.arrayContaining([res[0], res[1]]));
});
