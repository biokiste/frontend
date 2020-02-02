import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp } from "react-feather";
import { PurchaseCategories } from "../../consts";
import { toCurrency } from "../../utils/numbers";

const Model = {
  createdAt: {
    type: "Date"
  },
  [PurchaseCategories.CashPayment]: {
    type: "Number"
  },
  [PurchaseCategories.Deposit]: {
    type: "Number"
  },
  [PurchaseCategories.GiroTransfer]: {
    type: "Number"
  },
  [PurchaseCategories.ReducedVAT]: {
    type: "Number"
  },
  [PurchaseCategories.VAT]: {
    type: "Number"
  },
  total: {
    type: "Number"
  }
};

function CategoryHeader(props) {
  const { category, sortBy, sort, onChangeSort, onChangeSortBy } = props;
  const { t } = useTranslation(["transaction", "purchase"]);

  const handleSort = () => {
    onChangeSort && onChangeSort();
  };

  const handleSortBy = () => {
    onChangeSortBy && onChangeSortBy(category);
  };

  const value =
    t(category) === category ? t(`purchase:${category}`) : t(category);

  return sortBy === category ? (
    <>
      {value}
      <button className="focus:outline-none ml-2" onClick={handleSort}>
        {sort > 0 ? <ChevronDown size="24" /> : <ChevronUp size="24" />}
      </button>
    </>
  ) : (
    <button className="focus:outline-none font-bold" onClick={handleSortBy}>
      {value}
    </button>
  );
}

function TransactionList(props) {
  const { transactions = [] } = props;

  const keys = Object.keys(Model);
  const [sort, setSort] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");

  useEffect(() => {
    setSort(1);
  }, [sortBy]);

  const handleSort = () => {
    setSort(sort < 0 ? 1 : -1);
  };

  const handleSortBy = category => {
    setSortBy(category);
  };

  const sortedTransactions = transactions.sort((a, b) => {
    const valA = sort < 0 ? a[sortBy] : b[sortBy];
    const valB = sort < 0 ? b[sortBy] : a[sortBy];

    switch (Model[sortBy].type) {
      case "Date":
        return new Date(valA) - new Date(valB);
      default:
        return (valA || 0) - (valB || 0);
    }
  });

  return (
    <div className="w-full p-2">
      <table className="table-fixed w-full">
        <thead>
          <tr>
            {keys.map(key => {
              const categoryKey = Object.keys(PurchaseCategories).find(
                k => PurchaseCategories[k] === key
              );
              const value = PurchaseCategories[categoryKey] || key;
              return (
                <th
                  key={key}
                  className={`p-4 py-2 ${
                    categoryKey !== undefined
                      ? "invisible md:visible"
                      : `w-1/2 md:w-1/${keys.length}`
                  }`.trimRight()}
                >
                  <div className="flex flex-row justify-center">
                    <CategoryHeader
                      category={value}
                      sortBy={sortBy}
                      sort={sort}
                      onChangeSort={handleSort}
                      onChangeSortBy={handleSortBy}
                    />
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((transaction, idx) => {
            return (
              <tr
                key={`transaction-${idx}`}
                className={idx % 2 === 0 ? "bg-gray-100" : ""}
              >
                {keys.map(key => {
                  const type = Model[key].type;
                  const value = transaction[key];
                  const category = Object.keys(PurchaseCategories).find(
                    k => PurchaseCategories[k] === key
                  );
                  const output =
                    (value !== undefined &&
                      value !== 0 &&
                      (type === "Number" ? toCurrency(value) : "")) ||
                    (type === "Date" &&
                      value.toLocaleString("de-DE", {
                        dateStyle: "medium",
                        timeStyle: "short"
                      }));
                  return (
                    <td
                      key={key}
                      className={`border px-2 py-1 text-center md:w-1/${
                        keys.length
                      } ${
                        category !== undefined
                          ? "invisible md:visible"
                          : "w-1/2"
                      }`.trimRight()}
                    >
                      {output}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionList;
