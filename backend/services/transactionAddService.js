const transactionAddRepository = require('../repositories/transactionAddRepository');
const { mapToTransaction } = require('../mappers/transactionAddMapper');

async function toAddUserTransactions(transactions, userId) {
  const resultTransactions = []; // 箱
  let runTotalMap = {}; // 月ごとの合計を記録する（key: '2025-01'）

  // 日付昇順にソートする
  transactions.sort((a, b) => new Date(a.trans_date) - new Date(b.trans_date));

  for (const tx of transactions) {
    const txDate = new Date(tx.trans_date); // 各取引の日付
    const yearMonthKey = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`;

    // 月の初回はDBからその月の最新total_amountを取得
    if (!runTotalMap.hasOwnProperty(yearMonthKey)) {
      const startOfMonth = new Date(txDate.getFullYear(), txDate.getMonth(), 1);
      const endOfMonth = new Date(txDate.getFullYear(), txDate.getMonth() + 1, 0, 23, 59, 59, 999);

      // 月の最新の total_amount を取得
      const lastTotal = await transactionAddRepository.getLatestTransactionByMonth(userId, startOfMonth, endOfMonth);

      // lastTotal? = null や undefined のときは undefined を返す
      // total_amount?? = 左側の値が null または undefined のときだけ 0 を出力する
      runTotalMap[yearMonthKey] = lastTotal?.total_amount ?? 0;
    }

    const currentAmount = Number(tx.amount) || 0;
    const currentTotal = runTotalMap[yearMonthKey] + currentAmount;
    const mapped = mapToTransaction(tx, userId, currentTotal); // 累計のみ渡す
    resultTransactions.push(mapped);

    // 月ごとの合計も更新しておく
    runTotalMap[yearMonthKey] = currentTotal;
  }
  
  console.log('合計金額：')
  // 保存
  const savedata = await transactionAddRepository.insertMany(resultTransactions);

  // 最後の月の合計を返す
  const latestTx = resultTransactions[resultTransactions.length - 1];
  const latestDate = latestTx.trans_date;
  const latestKey = `${latestDate.getFullYear()}-${String(latestDate.getMonth() + 1).padStart(2, '0')}`;
  const initialTotal = runTotalMap[latestKey];

  return { initialTotal, saved: savedata };
}

module.exports = {
  toAddUserTransactions
};
