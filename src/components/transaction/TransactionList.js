import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp } from "react-feather";
import { toCurrency } from "../../utils/numbers";
import { aggregateDailyTransactions } from "../../utils/data";

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
  const { transactions = [], categories = [], balance = 0 } = props;

  const [dailyTransactions, setDailyTransactions] = useState([]);
  const [enhancedCategories, setEnhancedCategories] = useState([]);
  const [sort, setSort] = useState(1);
  const [sortBy, setSortBy] = useState(null);

  useEffect(() => {
    setSort(1);
  }, [sortBy]);

  useEffect(() => {
    const correctionIdx = categories.findIndex(
      item => item.type === "correction"
    );
    setEnhancedCategories([
      { type: "createdAt" },
      ...categories.slice(0, correctionIdx),
      ...categories.slice(correctionIdx + 1),
      { type: "dailyTotal" },
      { type: "balance" },
    ]);
  }, [categories]);

  useEffect(() => {
    setSortBy(enhancedCategories[0] && enhancedCategories[0].type);
  }, [enhancedCategories]);

  useEffect(() => {
    setDailyTransactions(
      aggregateDailyTransactions(transactions, categories, balance)
    );
  }, [transactions, categories, balance]);

  const handleSort = () => {
    setSort(sort < 0 ? 1 : -1);
  };

  const handleSortBy = category => {
    setSortBy(category);
  };

  const sortedTransactions = dailyTransactions.sort((a, b) => {
    const category = enhancedCategories.find(({ type }) => type === sortBy);

    if (!category) {
      return 0;
    }

    const valA = sort < 0 ? a[sortBy] : b[sortBy];
    const valB = sort < 0 ? b[sortBy] : a[sortBy];

    return category.type === "createdAt"
      ? new Date(valA) - new Date(valB)
      : (valA || 0) - (valB || 0);
  });

  const keys = enhancedCategories.map(category => category.type);

  return (
    <div className="w-full p-2">
      <table className="table-fixed w-full">
        <thead>
          <tr>
            {keys.map(key => {
              return (
                <th
                  key={key}
                  className={`p-4 py-2 ${
                    key === "createAt" || key === "total"
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
                {keys.map((key, idx, arr) => {
                  const value = transaction[key];
                  const output =
                    key !== "createdAt"
                      ? toCurrency(value)
                      : new Date(value).toLocaleString("de-DE", {
                          dateStyle: "medium",
                        });
                  return (
                    <td
                      key={key}
                      className={`border px-4 py-2 text-center md:w-1/${
                        keys.length
                      } ${
                        idx === 0 || idx === arr.length - 1
                          ? "invisible md:visible"
                          : "w-1/2"
                      }`.trimRight()}
                    >
                      {value !== 0 ? output : ""}
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
