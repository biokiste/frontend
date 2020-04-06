import URL from "url";
import { isAuthorized, Token } from "./utils";
import { getAllEntries } from "../../utils/api";

test("get all entries", async () => {
  const entryType = "entries";
  const rows = [
    { id: 1, key: "key1", userId: 1 },
    { id: 2, key: "key2", userId: 2 },
  ];

  fetch.mockResponse(req => {
    if (!isAuthorized(req)) {
      return Promise.resolve({ status: 401, statusText: "Unauthorized" });
    }
    if (!req.url.endsWith(entryType) && !req.url.includes(`/${entryType}?`)) {
      return Promise.resolve({ status: 404, statusText: "Not Found" });
    }
    const url = URL.parse(req.url, true);
    if (url.query.user_id) {
      return Promise.resolve(
        JSON.stringify(
          rows.filter(row => row.userId === parseInt(url.query.user_id))
        )
      );
    }
    if (url.query.key) {
      return Promise.resolve(
        JSON.stringify(rows.filter(row => row.key === url.query.key))
      );
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

  let entries = await getAllEntries(entryType, Token);
  expect(entries).toEqual(expect.arrayContaining(rows));

  entries = await getAllEntries(entryType, Token, { key: "key2" });
  expect(entries).not.toEqual(expect.arrayContaining([rows[0]]));

  entries = await getAllEntries(entryType, Token, { userId: 1 });
  expect(entries).not.toEqual(expect.arrayContaining([rows[1]]));
});
