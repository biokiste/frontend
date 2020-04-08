import { Token, isAuthorized } from "./utils";
import { addEntry } from "../../utils/api";

test("add entry", async () => {
  const entryType = "type";
  const rows = [
    { id: 1, key: "key1", userId: 1 },
    { id: 2, key: "key2", userId: 2 },
  ];

  fetch.mockResponse(req => {
    if (!req.url.endsWith(entryType)) {
      return Promise.reject("404 page not found");
    }
    if (!isAuthorized(req)) {
      return Promise.resolve({ status: 401 });
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
    return Promise.resolve(
      JSON.stringify({ id: rows[rows.length - 1].id + 1 })
    );
  });

  let error;
  try {
    await addEntry({}, entryType);
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Unauthorized"));

  try {
    await addEntry({}, entryType, Token);
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Some required fields are missing!"));

  const { id } = await addEntry({ key: "key3", userId: 3 }, entryType, Token);
  expect(id).toBe(3);
});
