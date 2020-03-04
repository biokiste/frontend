import React, { useState, useEffect } from "react";
import { PurchaseProvider, usePurchase } from "./PurchaseContext";
import { CalculatorProvider } from "./CalculatorContext";
import Calculator from "./Calculator";
import Overview from "./Overview";
import { toCurrency } from "../../utils/numbers";
import { getTextColor } from "../../utils/tailwind";
import { useTranslation } from "react-i18next";

function AccountStatus(props) {
  const { balance = 0 } = props;
  const [updatedBalance = 0, setUpdatedBalance] = useState();
  const { state } = usePurchase();
  const { t } = useTranslation("purchase");

  useEffect(() => {
    const result = Object.keys(state).reduce(
      (num, key) => num + state[key].reduce((sum, val) => sum + val, 0),
      balance
    );
    setUpdatedBalance(result);
  }, [state, balance]);
  return (
    <>
      <p>
        {t("balance")}: {toCurrency(balance)}
      </p>
      <p className={`${updatedBalance < 0 && getTextColor("red")}`}>
        {t("new balance")}: {toCurrency(updatedBalance)}
      </p>
    </>
  );
}

function CalculatorContainer(props) {
  const { categories } = props;
  const { add } = usePurchase();
  return (
    <CalculatorProvider>
      <Calculator onSubmit={add} categories={categories} />
    </CalculatorProvider>
  );
}

function PurchaseContainer(props) {
  const { balance = 0, onSubmit, categories = [] } = props;
  const { t } = useTranslation("purchase");
  return (
    <PurchaseProvider>
      <div className="w-full flex flex-row flex-wrap">
        <div className="w-full sm:w-1/2 p-2">
          {/** TODO: Create headline component */}
          <h1 className="text-4xl">{t("purchase")}</h1>
        </div>
        <div className="w-full sm:w-1/2 p-2 text-left sm:text-right text-xl">
          <AccountStatus balance={balance} />
        </div>
      </div>
      <div className="w-full md:w-1/2 lg:w-1/3 p-2">
        <CalculatorContainer categories={categories} />
      </div>
      <div className="w-full md:w-1/2 lg:w-2/3 p-2">
        <Overview
          onSubmit={onSubmit}
          categories={categories}
          balance={balance}
        />
      </div>
    </PurchaseProvider>
  );
}

export default PurchaseContainer;
