import React from "react";
import { Trash2 } from "react-feather";
import { usePurchase } from "./PurchaseContext";
import { toCurrency } from "../../utils/numbers";
import Button from "../common/Button";
import { useTranslation } from "react-i18next";

function CategoryHeader(props) {
  const { category, value } = props;
  const { t } = useTranslation("transaction");
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

  const handleClick = () => {
    remove(category, index);
  };
  return (
    <div className="flex flex-row justify-end p-2">
      <div className="px-2">{toCurrency(value)}</div>
      <div className="px-2">
        <button
          className="text-black focus:outline-none hover:opacity-50"
          onClick={handleClick}
        >
          <Trash2 />
        </button>
      </div>
    </div>
  );
}

function Overview(props) {
  const { onSubmit, categories = [] } = props;
  const { state, clear } = usePurchase();
  const { t } = useTranslation("transaction");

  const onClick = () => {
    onSubmit && onSubmit(state);
    clear();
  };

  const filteredCategories = categories
    .filter(category => {
      const { type } = category;
      return type !== "correction";
    })
    .sort((a, b) => a.type.localeCompare(b.type));

  const hasEntries = categories.some(
    category => state[category.type] && state[category.type].length > 0
  );

  const hasNegativeSum =
    Object.keys(state).reduce((num, key) => {
      const categorySum = state[key].reduce((sum, value) => sum + value, 0);
      return num + categorySum;
    }, 0) < 0;

  return (
    <>
      {filteredCategories.length > 0 &&
        filteredCategories.map(category => {
          const { type } = category;
          const sum =
            state[type] !== undefined
              ? state[type].reduce((num, cur) => num + cur, 0)
              : 0;
          return (
            <div key={type}>
              <CategoryHeader category={type} value={sum} />
              {state[type] &&
                state[type].map((value, index) => (
                  <Entry
                    key={category + value + index}
                    category={type}
                    value={value}
                    index={index}
                  />
                ))}
              {state[type] && state[type].length > 0 && (
                <hr className="border-2" />
              )}
            </div>
          );
        })}
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
