import React from "react";
import { render, wait } from "@testing-library/react";
import Setting from "../components/settings/SettingsItem";
import fetchMock from "fetch-mock";

test("render settings item", async () => {
  const title = "Setting One";
  const key = "setting1";
  const value = "value1";
  fetchMock.getOnce("/api/settings/setting1", JSON.stringify({ value }));
  const { getByTestId } = render(<Setting title={title} settingKey={key} />);
  expect(getByTestId("settings-item-title").textContent).toBe(`${title}:`);
  await wait(() => {
    expect(getByTestId("settings-item-value").textContent).toBe(value);
  });
});

test("handle settings item edit", () => {});
