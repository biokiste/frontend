import React from "react";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import centered from "@storybook/addon-centered/react";
import { Login } from ".";

storiesOf("Auth|Login", module)
  .addDecorator(centered)
  .add("default", () => {
    return (
      <div className="p-2">
        <Login onSubmit={action("onSubmit")} onReset={action("onReset")} />
      </div>
    );
  });
