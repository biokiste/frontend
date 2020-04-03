import { isAuthorized, Token } from "./utils";
import { getGroupById } from "../../utils/api";

test("get group by id", async () => {
  const res = [
    { id: 1, key: "group1" },
    { id: 2, key: "group2" },
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
    await getGroupById();
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Unauthorized"));

  try {
    await getGroupById(3, Token);
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Not Found"));

  const user = await getGroupById(1, Token);
  expect(user).toEqual(res[0]);
});
