import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toCurrency } from "../../utils/numbers";
import { aggregateDailyTransactions } from "../../utils/data";
import { ColumnSort } from "../table";

function TransactionList(props) {
  const { transactions = [], categories = [], balance = 0 } = props;

  const [dailyTransactions, setDailyTransactions] = useState([]);
  const [enhancedCategories, setEnhancedCategories] = useState([]);
  const [sort, setSort] = useState(1);
  const [sortBy, setSortBy] = useState(null);
  const { t } = useTranslation("transaction");

  useEffect(() => {
    setSort(1);
  }, [sortBy]);

  useEffect(() => {
    const sortedCategories = categories.sort((a, b) =>
      a.type.localeCompare(b.type)
    );
    const correctionIdx = sortedCategories.findIndex(
      item => item.type === "correction"
    );
    setEnhancedCategories([
      { type: "createdAt" },
      ...sortedCategories.slice(0, correctionIdx),
      ...sortedCategories.slice(correctionIdx + 1),
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

  // let styles = `lg:w-1/${keys.length}`;

  return (
    <div className="w-full p-2">
      <table className="table-fixed w-full">
        <thead>
          <tr>
            {keys.map(key => {
              let styles = "p-2";
              if (
                key !== "createdAt" &&
                key !== "dailyTotal" &&
                key !== "balance"
              ) {
                styles = `${styles} w-0 invisible lg:visible`;
              }
              if (key === "balance") {
                styles = `${styles} w-0 md:w-1/3 invisible md:visible`;
              }
              if (key === "createdAt" || key === "dailyTotal") {
                styles = `${styles} w-1/2 md:w-1/3`;
              }
              styles = `${styles} lg:w-1/${keys.length}`;

              return (
                <th key={key} className={styles}>
                  <ColumnSort
                    value={key}
                    title={t(key)}
                    sortKey={sortBy}
                    direction={sort}
                    onActive={handleSortBy}
                    onDirection={handleSort}
                  />
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
                  const value = transaction[key];
                  const output =
                    key !== "createdAt"
                      ? toCurrency(value)
                      : new Date(value).toLocaleDateString("de-DE", {
                          dateStyle: "medium",
                        });
                  let styles = "border px-4 py-2 text-center truncate";
                  if (
                    key !== "createdAt" &&
                    key !== "dailyTotal" &&
                    key !== "balance"
                  ) {
                    styles = `${styles} w-0 invisible lg:visible`;
                  }
                  if (key === "balance") {
                    styles = `${styles} w-0 md:w-1/3 invisible md:visible`;
                  }
                  if (key === "createdAt" || key === "dailyTotal") {
                    styles = `${styles} w-1/2 md:w-1/3`;
                  }
                  styles = `${styles} lg:w-1/${keys.length}`;
                  return (
                    <td key={key} className={styles}>
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
