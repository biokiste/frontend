import { updateEntry } from "../../utils/api";
import { Token, isAuthorized } from "./utils";

test("update entry", async () => {
  const entryType = "type";
  const rows = [
    { id: 1, key: "key1", userId: 1 },
    { id: 2, key: "key2", userId: 2 },
  ];

  fetch.mockResponse(req => {
    if (!req.url.includes(`/${entryType}/`)) {
      return Promise.reject("404 page not found");
    }
    if (!isAuthorized(req)) {
      return Promise.resolve({ status: 401 });
    }
    const id = req.url.split(`${entryType}/`)[1];
    const idx = rows.findIndex(row => row.id === parseInt(id));
    if (idx === -1) {
      return Promise.resolve({ status: 404 });
    }
    const body = JSON.parse(req.body);
    if (!body.key || !body.userId) {
      return Promise.resolve({
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: "Some required fields are missing!" }),
        status: 400,
      });
    }
    return Promise.resolve(JSON.stringify({ rowsAffected: 1 }));
  });

  let error;
  try {
    await updateEntry(1, {}, entryType);
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Unauthorized"));

  try {
    await updateEntry(1, {}, entryType, Token);
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Some required fields are missing!"));

  const { rowsAffected } = await updateEntry(
    1,
    { key: "key3", userId: 3 },
    entryType,
    Token
  );
  expect(rowsAffected).toBe(1);
});
