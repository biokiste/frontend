export function aggregateDailyTransactions(transactions, categories, balance) {
  const aggregated = transactions
    .reduce((arr, transaction) => {
      const { type, amount, created_at } = transaction;
      const createdAt = created_at.split(" ")[0];
      const idx = arr.findIndex(item => item.createdAt === createdAt);
      if (idx === -1) {
        const values = categories.reduce((obj, category) => {
          obj[category.type] = type === category.type ? amount : 0;
          return obj;
        }, {});
        arr.push({
          createdAt,
          transactions: [transaction],
          dailyTotal: amount,
          ...values,
        });
      } else {
        arr[idx].transactions.push(transaction);
        arr[idx][type] += amount;
        arr[idx].dailyTotal += amount;
      }
      return arr;
    }, [])
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((transaction, idx, arr) => {
      const { dailyTotal } = transaction;
      if (idx > 0) {
        transaction.balance = arr[idx - 1].balance + dailyTotal;
      } else {
        transaction.balance = dailyTotal;
      }
      return transaction;
    });
  return aggregated;
}
