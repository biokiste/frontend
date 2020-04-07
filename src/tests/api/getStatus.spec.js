import { getStatus } from "../../utils/api";

test("get status", async () => {
  fetch.mockResponseOnce(req => {
    if (!req.url.endsWith("status")) {
      return Promise.reject("404 page not found");
    }
    return Promise.resolve({ status: 200 });
  });
  const res = await getStatus();
  expect(res).toBe("ok");
});
