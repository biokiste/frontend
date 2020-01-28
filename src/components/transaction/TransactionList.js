import React from "react";
import { PurchaseCategories } from "../../consts";
import { useTransactions } from "./TransactionContext";
import { toCurrency } from "../../utils/numbers";

function TransactionList(props) {
  const categories = Object.keys(PurchaseCategories).sort((a, b) => a.localeCompare(b));
  const keys = ["Date", ...categories, "Balance"];
  const { transactions } = useTransactions();
  return (
    <div className="w-full p-2">
      <table className="table-fixed w-full">
        <thead>
          <tr>
            {keys.map(key => {
              const category = PurchaseCategories[key];
              return <th className={`p-4 py-2 ${category !== undefined ? "invisible md:visible" : `w-1/2 md:w-1/${categories.length + 2}`}`.trimRight()}>{category || key}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, idx) => {
            const { createdAt, total } = transaction;
            return (
              <tr className={idx % 2 === 0 ? "bg-gray-100" : ""}>
                <td className="border px-4 py-2 text-center">{createdAt.toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" })}</td>
                {categories.map(category => {
                  const value = transaction[PurchaseCategories[category]];
                  return <td className={`border px-4 py-2 text-center invisible md:visible md:w-1/${categories.length + 2}`}>{value !== undefined ? toCurrency(value) : ""}</td>
                })}
                <td className="border px-4 py-2 text-center">{toCurrency(total)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionList;