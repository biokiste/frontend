import React from "react";
import { render, wait } from "@testing-library/react";
import { StatesContext, StatesProvider } from "../contexts";

test("render received states", async () => {
  const route1 = "/states/type1";
  const route2 = "/states/type2";
  const states1 = ["state1", "state2"];
  const states2 = ["state3", "state4", "state5"];

  fetch.mockResponse(req => {
    switch (req.url) {
      case route1: {
        return Promise.resolve(JSON.stringify(states1));
      }
      case route2: {
        return Promise.resolve(JSON.stringify(states2));
      }
      default: {
        return Promise.reject(new Error("wrong route"));
      }
    }
  });

  const tree = (
    <StatesProvider routes={[route1, route2]}>
      <StatesContext.Consumer>
        {value => {
          const keys = Object.keys(value);
          const states = keys.reduce((arr, key) => arr.concat(value[key]), []);
          return (
            <>
              <span>Keys: {keys.join(", ")}</span>
              <span>States: {states.join(", ")}</span>
            </>
          );
        }}
      </StatesContext.Consumer>
    </StatesProvider>
  );

  const { getByText } = render(tree);

  expect(getByText(/^Keys:/).textContent).toBe("Keys: ");
  expect(getByText(/^States:/).textContent).toBe("States: ");

  await wait(() => {
    expect(getByText(/^Keys:/).textContent).toBe("Keys: type1, type2");
    expect(getByText(/^States:/).textContent).toBe(
      "States: state1, state2, state3, state4, state5"
    );
  });
});
