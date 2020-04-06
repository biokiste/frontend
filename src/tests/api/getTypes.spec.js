import { isAuthorized, Token } from "./utils";
import { getTypes } from "../../utils/api";

test("get types", async () => {
  const type = "type1";
  const res = ["type1", "type2", "type3"];

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
    await getTypes();
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Unauthorized"));

  try {
    await getTypes("foo", Token);
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Not Found"));

  const states = await getTypes(type, Token);
  expect(states).toEqual(expect.arrayContaining(res));
});
