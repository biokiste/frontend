import React from "react";
import { render, wait } from "@testing-library/react";
import user from "@testing-library/user-event";
import fetchMock from "fetch-mock";
import Setting from "../components/settings/SettingsItem";

test("render settings item", async () => {
  const title = "Setting One";
  const key = "setting1";
  const value = "value1";

  fetchMock.getOnce("/api/settings/setting1", JSON.stringify({ value }));

  const { getByTestId } = render(<Setting title={title} settingKey={key} />);

  expect(getByTestId("settings-item-title").textContent).toBe(`${title}`);
  await wait(() => {
    expect(getByTestId("settings-item-value").value).toBe(value);
  });
});

test("handle settings edit", async () => {
  const title = "Setting Two";
  const key = "setting2";
  const initialValue = "value";
  const newValue = "new value";

  fetchMock.getOnce(
    "/api/settings/setting2",
    JSON.stringify({ value: initialValue })
  );

  const { getByTestId } = render(
    <Setting title={title} settingKey={key} editable />
  );
  const input = getByTestId("settings-item-value");
  const toggle = getByTestId("settings-item-toggle");
  user.click(toggle);

  await wait(() => {
    expect(input.value).toBe(initialValue);
  });

  user.type(input, newValue);
  expect(input.value).toBe(newValue);

  fetchMock.patchOnce("/api/settings/setting2", { rowsAffected: 1 });
  user.click(toggle);

  await wait(() => {
    const [, { method, body }] = fetchMock.lastCall();
    const { value } = JSON.parse(body);
    expect(method).toBe("PATCH");
    expect(value).toBe(newValue);
  });
});
