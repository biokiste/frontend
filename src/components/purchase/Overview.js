import React from "react";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { usePurchase } from "./PurchaseContext";
import { toCurrency } from "../../utils/numbers";
import Button from "../common/Button";
import { PurchaseCategories } from "../../consts";

function CategoryHeader(props) {
  const { category, value } = props;
  return (
    <div className="flex flex-row p-3 border-b-2 border-dotted justify-between">
      <div className="font-bold">{category}</div>
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
        <button onClick={onClick}>
          <Icon icon={faTrash} />
        </button>
      </div>
    </div>
  );
}

function Overview(props) {
  const { onSubmit } = props;
  const { state } = usePurchase();
  const categories = Object.keys(state);

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
                key={category + entry + index}
                category={category}
                value={entry}
                index={index}
              />
            ))}
            {state[category].entries.length > 0 && <hr className="border-2" />}
          </div>
        ))}
      <div className="text-right mt-4">
        <Button
          value="Abschließen"
          color="green"
          onClick={onClick}
          disabled={!hasEntries || hasNegativeSum}
        />
      </div>
    </>
  );
}

export default Overview;
