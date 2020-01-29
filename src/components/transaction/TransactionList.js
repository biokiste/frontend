import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpCircle, ArrowDownCircle } from "react-feather";
import { PurchaseCategories } from "../../consts";
import { useTransactions } from "./TransactionContext";
import { toCurrency } from "../../utils/numbers";

function TransactionList(props) {
  const categories = Object.keys(PurchaseCategories).sort((a, b) =>
    a.localeCompare(b)
  );
  const keys = ["createdAt", ...categories, "total"];
  const { t } = useTranslation("transaction");
  const { transactions } = useTransactions();
  const sortBy = "createdAt";
  const [sort, setSort] = useState(1);

  const handleSort = () => {
    setSort(sort < 0 ? 1 : -1);
  };

  const sortedTransactions = transactions.sort((a, b) => {
    if (sort < 0) {
      return new Date(a[sortBy]) - new Date(b[sortBy]);
    }
    return new Date(b[sortBy]) - new Date(a[sortBy]);
  });

  return (
    <div className="w-full p-2">
      <table className="table-fixed w-full">
        <thead>
          <tr>
            {keys.map(key => {
              const category = PurchaseCategories[key];
              const value = category || key;
              return (
                <th
                  key={key}
                  className={`p-4 py-2 ${
                    category !== undefined
                      ? "invisible md:visible"
                      : `w-1/2 md:w-1/${categories.length + 2}`
                  }`.trimRight()}
                >
                  <div className="flex flex-row justify-center">
                    {sortBy === value && (
                      <button
                        className="mr-2 focus:outline-none"
                        onClick={handleSort}
                      >
                        {sort > 0 ? <ArrowDownCircle /> : <ArrowUpCircle />}
                      </button>
                    )}
                    {t(value)}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((transaction, idx) => {
            const { createdAt, total } = transaction;
            return (
              <tr
                key={`transaction-${idx}`}
                className={idx % 2 === 0 ? "bg-gray-100" : ""}
              >
                <td className="border px-4 py-2 text-center">
                  {createdAt.toLocaleString("de-DE", {
                    dateStyle: "medium",
                    timeStyle: "short"
                  })}
                </td>
                {categories.map(category => {
                  const value = transaction[PurchaseCategories[category]];
                  return (
                    <td
                      key={category}
                      className={`border px-4 py-2 text-center invisible md:visible md:w-1/${categories.length +
                        2}`}
                    >
                      {value !== undefined ? toCurrency(value) : ""}
                    </td>
                  );
                })}
                <td className="border px-4 py-2 text-center">
                  {toCurrency(total)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionList;
