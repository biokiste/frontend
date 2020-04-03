import { isAuthorized, Token } from "./utils";
import { getTransactionTypes } from "../../utils/api";

test("get types", async () => {
  const res = ["type1", "type2", "type3"];

  fetch.mockResponse(req =>
    Promise.resolve(
      isAuthorized(req)
        ? JSON.stringify(res)
        : { status: 401, statusText: "Unauthorized" }
    )
  );

  let error;
  try {
    await getTransactionTypes();
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Unauthorized"));
  const transactionTypes = await getTransactionTypes(Token);
  expect(transactionTypes).toEqual(expect.arrayContaining(res));
});
