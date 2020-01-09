import React from "react";
import { usePurchase } from "./PurchaseContext";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function CategoryHeader(props) {
  const { category, value } = props;
  return (
    <div className="flex flex-row p-3 border-b-2 border-dotted justify-between">
      <div className="font-bold">{category}</div>
      <div>{`${value.toFixed(2).replace(".", ",")} €`}</div>
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
      <div className="px-2">{`${value.toFixed(2).replace(".", ",")} €`}</div>
      <div className="px-2">
        <button onClick={onClick}>
          <Icon icon={faTrash} />
        </button>
      </div>
    </div>
  );
}

function Overview() {
  const { state } = usePurchase();
  const categories = Object.keys(state);
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
    </>
  );
}

export default Overview;
