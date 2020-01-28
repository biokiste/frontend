import React from "react";
import { PurchaseCategories } from "../../consts";
import { useTransactions } from "./TransactionContext";
import { toCurrency } from "../../utils/numbers";

function TransactionList(props) {
  const categories = Object.keys(PurchaseCategories).sort((a, b) => a.localeCompare(b));
  const keys = ["Date", ...categories, "Total"];
  const { transactions } = useTransactions();
  return (
    <table className="table-auto w-full">
      <thead>
        <tr>
          {keys.map(key => {
            return <th className="px-4 py-2">{PurchaseCategories[key] || key}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction, idx) => {
          const { createdAt, total } = transaction;
          return (
            <tr className={idx % 2 ? "bg-gray-200" : ""}>
              <td className="border px-4 py-2 text-center">{createdAt.toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" })}</td>
              {categories.map(category => {
                const value = transaction[PurchaseCategories[category]];
                return <td className="border px-4 py-2 text-center">{value !== undefined ? toCurrency(value) : ""}</td>
              })}
              <td className="border px-4 py-2 text-center">{toCurrency(total)}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  );
}

export default TransactionList;