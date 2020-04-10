import React from "react";
import fetchMock from "fetch-mock";
import { render, wait } from "@testing-library/react";
import { SmallSettingsItem } from ".";

test("render small settings item", async () => {
  const setting = { key: "setting1", value: "value setting 1" };

  fetchMock.getOnce("/api/settings/setting1", JSON.stringify(setting));

  const { getByTestId } = render(
    <SmallSettingsItem settingKey={setting.key} />
  );

  const key = getByTestId("settings-item-key");
  const value = getByTestId("settings-item-value");

  expect(key.textContent).toEqual(setting.key);
  expect(value.textContent).toEqual("");

  await wait(() => {
    expect(value.textContent).toEqual(setting.value);
  });
});
