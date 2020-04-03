import {
  getUserStates,
  getTransactionStates,
  getLoanStates,
} from "../../utils/api";
import { isAuthorized, Token } from "./utils";

test("get states from api", async () => {
  const res = ["state1", "state2", "state3"];

  fetch.mockResponse(req =>
    Promise.resolve(
      isAuthorized(req)
        ? JSON.stringify(res)
        : { status: 401, statusText: "Unauthorized" }
    )
  );

  let error;
  try {
    await getUserStates();
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Unauthorized"));
  const userStates = await getUserStates(Token);
  expect(userStates).toEqual(expect.arrayContaining(res));

  try {
    await getTransactionStates();
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Unauthorized"));
  const transactionStates = await getTransactionStates(Token);
  expect(transactionStates).toEqual(expect.arrayContaining(res));

  try {
    await getLoanStates();
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(new Error("Unauthorized"));
  const loanStates = await getLoanStates(Token);
  expect(loanStates).toEqual(expect.arrayContaining(res));
});
