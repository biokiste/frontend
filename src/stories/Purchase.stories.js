import React from "react";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import Calculator from "../components/purchase/Calculator";
import { CalculatorProvider } from "../components/purchase/CalculatorContext";
import Container from "../components/purchase/Container";
import Overview from "../components/purchase/Overview";
import { PurchaseProvider } from "../components/purchase/PurchaseContext";
import { PurchaseCategories } from "../components/purchase/consts";

storiesOf("Purchase|Container", module).add("default", () => {
  return <Container />;
});

storiesOf("Purchase|Overview", module)
  .add("default", () => {
    return (
      <PurchaseProvider>
        <Overview />
      </PurchaseProvider>
    );
  })
  .add("with initial state", () => {
    const initialState = {
      [PurchaseCategories.GiroTransfer]: { entries: [1.01, 20.99] }
    };
    return (
      <PurchaseProvider initialState={initialState}>
        <Overview />
      </PurchaseProvider>
    );
  });

storiesOf("Purchase|Calculator", module)
  .add("default", () => {
    return (
      <CalculatorProvider>
        <Calculator />
      </CalculatorProvider>
    );
  })
  .add("with submit callback", () => {
    return (
      <CalculatorProvider>
        <Calculator onSubmit={action("submit")} />
      </CalculatorProvider>
    );
  });
