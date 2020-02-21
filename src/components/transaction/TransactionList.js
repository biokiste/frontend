import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toCurrency } from "../../utils/numbers";
import { aggregateDailyTransactions } from "../../utils/data";
import { ColumnSort, Row } from "../table";
import { getColumnVisibility, getColumnWidth } from "../../utils/tailwind";

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

  const keys = enhancedCategories.map(category => category.type);

  const sortedTransactions = dailyTransactions
    .sort((a, b) => {
      const category = enhancedCategories.find(({ type }) => type === sortBy);

      if (!category) {
        return 0;
      }

      const valA = sort < 0 ? a[sortBy] : b[sortBy];
      const valB = sort < 0 ? b[sortBy] : a[sortBy];

      return category.type === "createdAt"
        ? new Date(valA) - new Date(valB)
        : (valA || 0) - (valB || 0);
    })
    .map(transaction => {
      const copy = { ...transaction };
      keys.forEach(key => {
        if (!copy[key]) {
          copy[key] = "";
        } else {
          const value = copy[key];
          const formattedValue =
            key !== "createdAt"
              ? toCurrency(value)
              : new Date(value).toLocaleDateString("de-DE", {
                  dateStyle: "medium",
                });
          copy[key] = formattedValue;
        }
      });
      return copy;
    });

  const columns = {
    visible: ["createdAt", "dailyTotal"],
    md: ["balance"],
    lg: categories
      .map(category => category.type)
      .filter(type => type !== "correction"),
  };

  return (
    <div className="w-full p-2">
      <table className="table-fixed w-full">
        <thead>
          <tr>
            {keys.map(key => {
              const visibility = getColumnVisibility(columns, key);
              const width = getColumnWidth(columns, key);

              return (
                <th key={key} className={`p-2 ${visibility} ${width}`}>
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
              <Row
                key={transaction.date}
                index={idx}
                columns={columns}
                values={transaction}
                sorting={keys}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionList;
