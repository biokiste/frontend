import { isAuthorized, Token } from "./utils";
import { getSettings } from "../../utils/api";

test("get settings", async () => {
  const res = [
    { id: 1, key: "key1", value: "value1" },
    { id: 2, key: "key2", value: "value2" },
  ];

  fetch.mockResponse(req =>
    Promise.resolve(
      isAuthorized(req)
        ? JSON.stringify(res)
        : { status: 401, statusText: "Unauthorized" }
    )
  );

  let error;
  try {
    await getSettings();
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Unauthorized"));
  const settings = await getSettings(Token);
  expect(settings).toEqual(expect.arrayContaining(res));
});
