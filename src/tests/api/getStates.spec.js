import { getStates } from "../../utils/api";
import { isAuthorized, Token } from "./utils";

test("get states", async () => {
  const type = "type1";
  const res = ["state1", "state2", "state3"];

  fetch.mockResponse(req => {
    if (!isAuthorized(req)) {
      return Promise.resolve({ status: 401, statusText: "Unauthorized" });
    }
    if (!req.url.endsWith(type) && !req.url.includes(`/${type}?`)) {
      return Promise.resolve({ status: 404, statusText: "Not Found" });
    }
    return Promise.resolve(JSON.stringify(res));
  });

  let error;
  try {
    await getStates();
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Unauthorized"));

  try {
    await getStates("foo", Token);
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Not Found"));

  const states = await getStates(type, Token);
  expect(states).toEqual(expect.arrayContaining(res));
});
