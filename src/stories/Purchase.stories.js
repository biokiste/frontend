import React from "react";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import Calculator from "../components/purchase/Calculator";
import { CalculatorProvider } from "../components/purchase/CalculatorContext";
import PurchaseContainer from "../components/purchase/PurchaseContainer";
// import Overview from "../components/purchase/Overview";
// import {
//   PurchaseProvider,
//   usePurchase,
// } from "../components/purchase/PurchaseContext";
import { /*PurchaseCategories, */ Stories } from "../consts";
import { AlertProvider } from "../components/common/Alert";

storiesOf("Purchase|PurchaseContainer", module).add("default", () => {
  return (
    <AlertProvider>
      <div className="container mx-auto p-2 flex flex-row flex-wrap">
        <PurchaseContainer
          onSubmit={action("onSubmit")}
          categories={Stories.TransactionCategories}
        />
      </div>
    </AlertProvider>
  );
});

storiesOf("Purchase|Calculator", module).add("default", () => {
  return (
    <CalculatorProvider>
      <Calculator
        categories={Stories.TransactionCategories}
        onSubmit={action("onSubmit")}
      />
    </CalculatorProvider>
  );
});
