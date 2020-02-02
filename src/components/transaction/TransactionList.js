import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp } from "react-feather";
import { PurchaseCategories } from "../../consts";
import { toCurrency } from "../../utils/numbers";

function formatValue(value, type, isCategory) {
  if (value === undefined || (isCategory && value === 0)) {
    return "";
  }
  switch (type) {
    case "Date":
      return value.toLocaleString("de-DE", {
        dateStyle: "medium"
      });
    default:
      return toCurrency(value);
  }
}

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
  const { transactions = [], categories = [] } = props;

  const keys = categories.map(category => category.name);
  const [sort, setSort] = useState(1);
  const [sortBy, setSortBy] = useState(keys[0]);

  useEffect(() => {
    setSort(1);
  }, [sortBy]);

  useEffect(() => {
    setSortBy(categories[0] && categories[0].name);
  }, [categories]);

  const handleSort = () => {
    setSort(sort < 0 ? 1 : -1);
  };

  const handleSortBy = category => {
    setSortBy(category);
  };

  const sortedTransactions = transactions.sort((a, b) => {
    const category = categories.find(({ name }) => name === sortBy);

    if (!category) {
      return 0;
    }

    const valA = sort < 0 ? a[sortBy] : b[sortBy];
    const valB = sort < 0 ? b[sortBy] : a[sortBy];

    switch (category.type) {
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
                      category={key}
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
                  const { type } = categories.find(({ name }) => name === key);
                  const value = transaction[key];
                  const category = Object.keys(PurchaseCategories).find(
                    k => PurchaseCategories[k] === key
                  );
                  const isCategory = category !== undefined;
                  const output = formatValue(value, type, isCategory);
                  return (
                    <td
                      key={key}
                      className={`border px-4 py-2 text-center md:w-1/${
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
