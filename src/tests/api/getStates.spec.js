import { getStates } from "../../utils/api";
import { isAuthorized, Token } from "./utils";

test("get states", async () => {
  const type = "type1";
  const res = ["state1", "state2", "state3"];

  fetch.mockResponse(req => {
    if (!req.url.endsWith(type) && !req.url.includes(`/${type}?`)) {
      return Promise.reject("404 page not found");
    }
    if (!isAuthorized(req)) {
      return Promise.resolve({ status: 401 });
    }
    return Promise.resolve(JSON.stringify(res));
  });

  let error;
  try {
    await getStates(type);
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Unauthorized"));

  const states = await getStates(type, Token);
  expect(states).toEqual(expect.arrayContaining(res));
});
