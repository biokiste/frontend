import React from "react";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import Calculator from "../components/purchase/Calculator";
import { CalculatorProvider } from "../components/purchase/CalculatorContext";
import Container from "../components/purchase/PurchaseContainer";
import Overview from "../components/purchase/Overview";
import { PurchaseProvider } from "../components/purchase/PurchaseContext";
import { PurchaseCategories } from "../consts";
import { AlertProvider } from "../components/common/Alert";

storiesOf("Purchase|Container", module)
  .add("default", () => {
    return (
      <AlertProvider>
        <div className="container mx-auto p-2 flex flex-row flex-wrap">
          <Container onSubmit={action("onSubmit")} />
        </div>
      </AlertProvider>
    );
  })
  .add("with account balance", () => {
    return (
      <AlertProvider>
        <div className="container mx-auto p-2 flex flex-row flex-wrap">
          <Container accountBalance={200} onSubmit={action("onSubmit")} />
        </div>
      </AlertProvider>
    );
  });

storiesOf("Purchase|Overview", module)
  .add("default", () => {
    return (
      <AlertProvider>
        <PurchaseProvider>
          <Overview onSubmit={action("onSubmit")} />
        </PurchaseProvider>
      </AlertProvider>
    );
  })
  .add("with initial state", () => {
    const initialState = {
      [PurchaseCategories.GiroTransfer]: {
        entries: [{ value: 1.01 }, { value: 20.99 }]
      }
    };
    return (
      <AlertProvider>
        <PurchaseProvider initialState={initialState}>
          <Overview onSubmit={action("onSubmit")} />
        </PurchaseProvider>
      </AlertProvider>
    );
  })
  .add("with inital balance negative sum", () => {
    const initialState = {
      [PurchaseCategories.VAT]: {
        entries: [{ value: 4.99 }, { value: 1.99 }]
      },
      [PurchaseCategories.ReducedVAT]: {
        entries: [{ value: 3.99 }]
      }
    };
    return (
      <AlertProvider>
        <PurchaseProvider initialState={initialState}>
          <Overview onSubmit={action("onSubmit")} balance={10} />
        </PurchaseProvider>
      </AlertProvider>
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
