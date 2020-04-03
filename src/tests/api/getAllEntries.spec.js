import { isAuthorized, Token } from "./utils";
import { getAllEntries } from "../../utils/api";

test("get all entries", async () => {
  const entryType = "entries";
  const rows = [
    { id: 1, key: "group1" },
    { id: 2, key: "group2" },
  ];

  fetch.mockResponse(req => {
    if (!isAuthorized(req)) {
      return Promise.resolve({ status: 401, statusText: "Unauthorized" });
    }
    if (!req.url.endsWith(entryType)) {
      return Promise.resolve({ status: 404, statusText: "Not Found" });
    }
    return Promise.resolve(JSON.stringify(rows));
  });

  let error;
  try {
    await getAllEntries();
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Unauthorized"));

  try {
    await getAllEntries("unavailable", Token);
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Not Found"));

  const entries = await getAllEntries(entryType, Token);
  expect(entries).toEqual(expect.arrayContaining(rows));
});
