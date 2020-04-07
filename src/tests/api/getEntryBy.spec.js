import { isAuthorized, Token } from "./utils";
import { getEntryBy } from "../../utils/api";

test("get group by id", async () => {
  const entryType = "type";

  const res = [{ key: "key1" }, { key: "key2" }];

  fetch.mockResponse(req => {
    if (!req.url.includes(`/${entryType}/`)) {
      return Promise.reject("404 page not found");
    }
    if (!isAuthorized(req)) {
      return Promise.resolve({ status: 401 });
    }
    const parts = req.url.split("/");
    const identifier = parts[parts.length - 1];
    const idx = res.findIndex(item => item.key === identifier);
    return Promise.resolve(
      idx === -1 ? { status: 404 } : JSON.stringify(res[idx])
    );
  });

  let error;
  try {
    await getEntryBy("key1", entryType);
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Unauthorized"));

  try {
    await getEntryBy("key3", entryType, Token);
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Not Found"));

  const entry = await getEntryBy("key1", entryType, Token);
  expect(entry).toEqual(res[0]);
});
