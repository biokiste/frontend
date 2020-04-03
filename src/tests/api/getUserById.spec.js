import { isAuthorized, Token } from "./utils";
import { getUserById } from "../../utils/api";

test("get user by id", async () => {
  const res = [
    { id: 1, firstName: "Test1", lastName: "Test1" },
    { id: 2, firstName: "Test2", lastName: "Test2" },
  ];

  fetch.mockResponse(req => {
    if (!isAuthorized(req)) {
      return Promise.resolve({ status: 401, statusText: "Unauthorized" });
    }
    const parts = req.url.split("/");
    const id = parts[parts.length - 1];
    const idx = res.findIndex(item => item.id === parseInt(id));
    return Promise.resolve(
      idx === -1
        ? { status: 404, statusText: "Not Found" }
        : JSON.stringify(res[idx])
    );
  });

  let error;
  try {
    await getUserById();
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Unauthorized"));

  try {
    await getUserById(3, Token);
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Not Found"));

  const user = await getUserById(1, Token);
  expect(user).toEqual(res[0]);
});
