import React from "react";
import { storiesOf } from "@storybook/react";
import Purchase from "../views/Purchase";
import ViewContainer from "../views/ViewContainer";

storiesOf("Views|Purchase", module).add("default", () => {
  return (
    <ViewContainer>
      <Purchase />
    </ViewContainer>
  );
});
