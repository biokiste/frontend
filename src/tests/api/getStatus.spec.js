import { getStatus } from "../../utils/api";

test("get api status", async () => {
  fetch.mockResponseOnce(req =>
    Promise.resolve({ status: 400, statusText: "Bad Request" })
  );
  let error;
  try {
    await getStatus();
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Bad Request"));
  fetch.mockResponseOnce("ok", { status: 200, statusText: "Ok" });
  const res = await getStatus();
  expect(res).toBe("ok");
});
