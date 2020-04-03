import { isAuthorized } from "./utils";
import { getUsers } from "../../utils/api";

test("get users", async () => {
  const token = "Token";
  const res = [
    { id: 1, firstName: "Test1", lastName: "Test1" },
    { id: 2, firstName: "Test2", lastName: "Test2" },
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
    await getUsers();
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Unauthorized"));
  const users = await getUsers(token);
  expect(users).toEqual(expect.arrayContaining(res));
});
