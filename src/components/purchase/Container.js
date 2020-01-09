import React from "react";
import { PurchaseProvider, usePurchase } from "./PurchaseContext";
import { CalculatorProvider } from "./CalculatorContext";
import Calculator from "./Calculator";
import Overview from "./Overview";

function CalculatorContainer() {
  const { add } = usePurchase();
  return (
    <CalculatorProvider>
      <Calculator onSubmit={add} />
    </CalculatorProvider>
  );
}

function Container() {
  return (
    <div className="container mx-auto p-2 flex flex-row flex-wrap">
      <PurchaseProvider>
        <div className="w-full md:w-1/2 lg:w-1/3 p-2">
          <CalculatorContainer />
        </div>
        <div className="w-full md:w-1/2 lg:w-2/3 p-2">
          <Overview />
        </div>
      </PurchaseProvider>
    </div>
  );
}

export default Container;
