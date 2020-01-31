import React, { useState, useEffect } from "react";
import { PurchaseProvider, usePurchase } from "./PurchaseContext";
import { CalculatorProvider } from "./CalculatorContext";
import Calculator from "./Calculator";
import Overview from "./Overview";
import { PurchaseCategories } from "../../consts";
import { toCurrency } from "../../utils/numbers";
import { getTextColor } from "../../utils/tailwind";
import { useTranslation } from "react-i18next";

function AccountStatus(props) {
  const { accountBalance } = props;
  const [updatedBalance = 0, setUpdatedBalance] = useState();
  const { state } = usePurchase();
  const { t } = useTranslation("purchase");

  useEffect(() => {
    const result = Object.keys(state).reduce((num, key) => {
      if (
        [
          PurchaseCategories.GiroTransfer,
          PurchaseCategories.CashPayment,
          PurchaseCategories.Deposit
        ].some(value => value === key)
      ) {
        return num + state[key].sum;
      }
      return num - state[key].sum;
    }, accountBalance);
    setUpdatedBalance(result);
  }, [state, accountBalance]);
  return (
    <>
      <p>{t("balance")}: {toCurrency(accountBalance)}</p>
      <p className={`${updatedBalance < 0 && getTextColor("red")}`}>
        {t("new balance")}: {toCurrency(updatedBalance)}
      </p>
    </>
  );
}

function CalculatorContainer() {
  const { add } = usePurchase();
  return (
    <CalculatorProvider>
      <Calculator onSubmit={add} />
    </CalculatorProvider>
  );
}

function PurchaseContainer(props) {
  const { accountBalance = 0, onSubmit } = props;
  const { t } = useTranslation("purchase");
  return (
    <PurchaseProvider>
      <div className="w-full flex flex-row flex-wrap">
        <div className="w-full sm:w-1/2 p-2">
          {/** TODO: Create headline component */}
          <h1 className="text-4xl">{t("purchase")}</h1>
        </div>
        <div className="w-full sm:w-1/2 p-2 text-left sm:text-right text-xl">
          <AccountStatus accountBalance={accountBalance} />
        </div>
      </div>
      <div className="w-full md:w-1/2 lg:w-1/3 p-2">
        <CalculatorContainer />
      </div>
      <div className="w-full md:w-1/2 lg:w-2/3 p-2">
        <Overview onSubmit={onSubmit} />
      </div>
    </PurchaseProvider>
  );
}

export default PurchaseContainer;