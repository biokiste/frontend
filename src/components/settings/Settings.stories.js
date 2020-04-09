import React from "react";
import { storiesOf } from "@storybook/react";
import centered from "@storybook/addon-centered/react";
import fetchMock from "fetch-mock";
import SettingsItem from "./SettingsItem";

storiesOf("Settings|SettingsItem", module)
  .addDecorator(centered)
  .add("default", () => {
    fetchMock.getOnce("/api/settings/setting1", { value: "fetched value" });
    return <SettingsItem title="Setting One" settingKey="setting1" />;
  })
  .add("editable", () => {
    fetchMock.getOnce("/api/settings/setting2", { value: "initial value" });
    fetchMock.patchOnce("/api/settings/setting2", { rowsAffected: 1 });
    return <SettingsItem title="Setting Two" settingKey="setting2" editable />;
  });
