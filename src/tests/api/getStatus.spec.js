import { getStatus } from "../../utils/api";

test("get status", async () => {
  fetch.mockResponseOnce(req => Promise.resolve({ status: 400 }));
  let error;
  try {
    await getStatus();
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Bad Request"));
  fetch.mockResponseOnce({ status: 200 });
  const res = await getStatus();
  expect(res).toBe("ok");
});
