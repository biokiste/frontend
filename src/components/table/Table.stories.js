import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import centered from "@storybook/addon-centered/react";
import { ColumnSort } from "./.";

storiesOf("Table|ColumnSort", module)
  .addParameters({ component: ColumnSort })
  .addDecorator(centered)
  .add("not active", () => {
    return (
      <ColumnSort
        sortKey="something else"
        direction={1}
        value="column key"
        title="Column Title"
        onActive={action("onActive")}
      />
    );
  })
  .add("active", () => {
    return (
      <ColumnSort
        sortKey="column key"
        direction={1}
        value="column key"
        title="Column Title"
        onDirection={action("onDirection")}
      />
    );
  })
  .add("with state handling", () => {
    const [sortKey, setSortKey] = useState("");
    const [direction, setDirection] = useState(1);

    const onActive = value => {
      setSortKey(value);
    };

    const onDirection = value => {
      setDirection(value);
    };

    return (
      <ColumnSort
        sortKey={sortKey}
        direction={direction}
        value="column key"
        title="Column Title"
        onActive={onActive}
        onDirection={onDirection}
      />
    );
  });
