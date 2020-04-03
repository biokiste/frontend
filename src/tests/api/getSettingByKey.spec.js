import { isAuthorized, Token } from "./utils";
import { getSettingByKey } from "../../utils/api";

test("get setting by key", async () => {
  const res = [
    { id: 1, key: "key1", value: "value1" },
    { id: 2, key: "key2", value: "value2" },
  ];

  fetch.mockResponse(req => {
    if (!isAuthorized(req)) {
      return Promise.resolve({ status: 401, statusText: "Unauthorized" });
    }
    const parts = req.url.split("/");
    const key = parts[parts.length - 1];
    const idx = res.findIndex(item => item.key === key);
    return Promise.resolve(
      idx === -1
        ? { status: 404, statusText: "Not Found" }
        : JSON.stringify(res[idx])
    );
  });

  let error;
  try {
    await getSettingByKey();
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Unauthorized"));

  try {
    await getSettingByKey("key3", Token);
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Not Found"));

  const user = await getSettingByKey("key1", Token);
  expect(user).toEqual(res[0]);
});
