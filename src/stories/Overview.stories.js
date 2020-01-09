import React from "react";
import Overview from "../components/purchase/Overview";
import { PurchaseProvider } from "../components/purchase/PurchaseContext";
import { PurchaseCategories } from "../components/purchase/consts";

export default {
  title: "Purchase|Overview"
};

export const withDefault = () => (
  <PurchaseProvider>
    <Overview />
  </PurchaseProvider>
);

export const withInitialState = () => {
  const initialState = {
    [PurchaseCategories.GiroTransfer]: { entries: [1.01, 20.99] }
  };
  return (
    <PurchaseProvider initialState={initialState}>
      <Overview />
    </PurchaseProvider>
  );
};
