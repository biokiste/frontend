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
  });
