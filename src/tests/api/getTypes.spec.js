import { isAuthorized, Token } from "./utils";
import { getTypes } from "../../utils/api";

test("get types", async () => {
  const type = "type1";
  const res = ["type1", "type2", "type3"];

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
    await getTypes(type);
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Unauthorized"));

  const states = await getTypes(type, Token);
  expect(states).toEqual(expect.arrayContaining(res));
});
