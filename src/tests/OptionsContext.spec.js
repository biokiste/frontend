import React from "react";
import { render, wait } from "@testing-library/react";
import { OptionsContext, OptionsProvider } from "../contexts";

test("render received options", async () => {
  const route1 = "/option_1/key_1";
  const route2 = "/option_1/key_2";
  const route3 = "/option_2/key_1";
  const values1 = ["value1", "value2"];
  const values2 = ["value3"];
  const values3 = ["value4", "value5", "value6"];

  fetch.mockResponse(req => {
    switch (req.url) {
      case route1: {
        return Promise.resolve(JSON.stringify(values1));
      }
      case route2: {
        return Promise.resolve(JSON.stringify(values2));
      }
      case route3: {
        return Promise.resolve(JSON.stringify(values3));
      }
      default: {
        return Promise.reject(new Error("wrong route"));
      }
    }
  });

  const tree = (
    <OptionsProvider routes={[route1, route2, route3]}>
      <OptionsContext.Consumer>
        {value => {
          const options = Object.keys(value);
          const keysRoute1 =
            options.length > 0 ? Object.keys(value.option_1) : [];
          const valuesRoute3 = (value.option_2 && value.option_2.key_1) || [];
          return (
            <>
              <span>Options: {options.join(", ")}</span>
              <span>Keys: {keysRoute1.join(", ")}</span>
              <span>Values: {valuesRoute3.join(", ")}</span>
            </>
          );
        }}
      </OptionsContext.Consumer>
    </OptionsProvider>
  );

  const { getByText } = render(tree);

  expect(getByText(/^Options:/).textContent).toBe("Options: ");
  expect(getByText(/^Keys:/).textContent).toBe("Keys: ");
  expect(getByText(/^Values:/).textContent).toBe("Values: ");

  await wait(() => {
    expect(getByText(/^Options:/).textContent).toBe(
      "Options: option_1, option_2"
    );
    expect(getByText(/^Keys:/).textContent).toBe("Keys: key_1, key_2");
    expect(getByText(/^Values:/).textContent).toBe(
      "Values: value4, value5, value6"
    );
  });
});
