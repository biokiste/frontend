export function aggregateDailyTransactions(transactions, categories) {
  const aggregated = transactions.reduce((arr, transaction) => {
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
        total: amount,
        ...values,
      });
    } else {
      arr[idx].transactions.push(transaction);
      arr[idx][type] += amount;
      arr[idx].total += amount;
    }
    return arr;
  }, []);
  return aggregated;
}
