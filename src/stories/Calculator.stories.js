import React from "react";
import { action } from "@storybook/addon-actions";
import Calculator from "../components/purchase/Calculator";
import { CalculatorProvider } from "../components/purchase/CalculatorContext";

export default {
  title: "Calculator"
};

export const withDefault = () => (
  <CalculatorProvider>
    <Calculator />
  </CalculatorProvider>
);

export const withSubmitCallback = () => (
  <CalculatorProvider>
    <Calculator onSubmit={action("submit")} />
  </CalculatorProvider>
);
