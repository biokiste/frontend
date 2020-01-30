import React from "react";
import { Trash2 } from "react-feather";
import { usePurchase } from "./PurchaseContext";
import { toCurrency } from "../../utils/numbers";
import Button from "../common/Button";
import { PurchaseCategories } from "../../consts";
import { useTranslation } from "react-i18next";

function CategoryHeader(props) {
  const { category, value } = props;
  const { t } = useTranslation("purchase");
  return (
    <div className="flex flex-row p-3 border-b-2 border-dotted justify-between">
      <div className="font-bold">{t(category)}</div>
      <div>{toCurrency(value)}</div>
    </div>
  );
}

function Entry(props) {
  const { category, value, index } = props;
  const { remove } = usePurchase(category);

  const onClick = () => {
    remove(category, index);
  };
  return (
    <div className="flex flex-row justify-end p-2">
      <div className="px-2">{toCurrency(value)}</div>
      <div className="px-2">
        <button
          className="text-black focus:outline-none hover:opacity-50"
          onClick={onClick}
        >
          <Trash2 />
        </button>
      </div>
    </div>
  );
}

function Overview(props) {
  const { onSubmit } = props;
  const { state } = usePurchase();
  const { t } = useTranslation("purchase");
  const categories = Object.keys(state).sort((a, b) => a.localeCompare(b));

  const onClick = () => {
    onSubmit && onSubmit(state);
  };

  const hasEntries = categories.some(
    category => state[category].entries.length > 0
  );

  const hasNegativeSum =
    categories.reduce((num, category) => {
      if (
        [
          PurchaseCategories.GiroTransfer,
          PurchaseCategories.CashPayment,
          PurchaseCategories.Deposit
        ].some(key => key === category)
      ) {
        return num + state[category].sum;
      }
      return num - state[category].sum;
    }, 0) < 0;

  return (
    <>
      {categories.length > 0 &&
        categories.map(category => (
          <div key={category}>
            <CategoryHeader category={category} value={state[category].sum} />
            {state[category].entries.map((entry, index) => (
              <Entry
                key={category + entry.value + index}
                category={category}
                value={entry.value}
                index={index}
              />
            ))}
            {state[category].entries.length > 0 && <hr className="border-2" />}
          </div>
        ))}
      <div className="text-right mt-4">
        <Button
          value={t("submit")}
          color="green"
          onClick={onClick}
          disabled={!hasEntries || hasNegativeSum}
        />
      </div>
    </>
  );
}

export default Overview;
