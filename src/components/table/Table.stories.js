import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import centered from "@storybook/addon-centered/react";
import { ColumnSort, Row } from "./.";

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

storiesOf("Table|Row", module)
  .addParameters({ component: Row })
  .addDecorator(centered)
  .add("with values", () => {
    const columns = ["key1", "key2", "key3"];
    const data = [
      { key1: "value1-1", key2: "value2-1", key3: "value3-1" },
      { key1: "value1-2", key2: "value2-2", key3: "value3-2" },
    ];
    return (
      <table>
        <tbody>
          {data.map((values, idx) => (
            <Row index={idx} columns={columns} values={values} />
          ))}
        </tbody>
      </table>
    );
  })
  .add("with responsive columns", () => {
    const columns = {
      visible: ["alwaysVisibleKey"],
      sm: ["smallKey"],
      md: ["mediumKey"],
      lg: ["largeKey"],
    };
    const data = [
      {
        alwaysVisibleKey: "value1-1",
        smallKey: "value2-1sm",
        mediumKey: "value3-1md",
        largeKey: "value4-1lg",
      },
      {
        alwaysVisibleKey: "value1-2",
        smallKey: "value2-2sm",
        mediumKey: "value3-2md",
        largeKey: "value4-2lg",
      },
    ];
    return (
      <table>
        <tbody>
          {data.map((values, idx) => (
            <Row index={idx} columns={columns} values={values} />
          ))}
        </tbody>
      </table>
    );
  });
