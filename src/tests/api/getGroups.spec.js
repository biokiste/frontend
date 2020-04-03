import { isAuthorized, Token } from "./utils";
import { getGroups } from "../../utils/api";

test("get groups", async () => {
  const res = [
    { id: 1, key: "group1" },
    { id: 2, key: "group2" },
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
    await getGroups();
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Unauthorized"));
  const groups = await getGroups(Token);
  expect(groups).toEqual(expect.arrayContaining(res));
});
