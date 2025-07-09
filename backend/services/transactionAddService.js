const transactionAddRepository = require('../repositorys/transactionAddRepository');
const { mapToTransaction } = require('../mappers/transactionAddMapper');

async function toAddUserTransactions(transactions, userId) {
  const resultTransactions = []; // 箱
  let runTotalMap = {}; // 月ごとの合計を記録する（key: '2025-01'）

  for (const tx of transactions) {
    const txDate = new Date(tx.date); // 各取引の日付
    const yearMonthKey = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`;

    // 初回のみ、その月の合計を取得して保存
    if (!runTotalMap.hasOwnProperty(yearMonthKey)) {
      const startOfMonth = new Date(txDate.getFullYear(), txDate.getMonth(), 1);
      const endOfMonth = new Date(txDate.getFullYear(), txDate.getMonth() + 1, 0, 23, 59, 59, 999);
      const lastTotal = await transactionAddRepository.getLastTotalAmountByMonth(userId, startOfMonth, endOfMonth);
      runTotalMap[yearMonthKey] = lastTotal || 0;
    }

    const runTotal = runTotalMap[yearMonthKey];
    const mapped = mapToTransaction(tx, userId, runTotal);
    resultTransactions.push(mapped);

    // 月ごとの合計も更新しておく
    runTotalMap[yearMonthKey] += mapped.amount;
  }

  // 保存
  await transactionAddRepository.insertMany(resultTransactions);

  // 最後に登録した月の runTotal を initialTotal として返す（例：画面表示用など）
  const latestTx = resultTransactions[resultTransactions.length - 1];
  const latestDate = latestTx.trans_date;
  const latestKey = `${latestDate.getFullYear()}-${String(latestDate.getMonth() + 1).padStart(2, '0')}`;
  const initialTotal = runTotalMap[latestKey];

  return { initialTotal, saved: resultTransactions };
}

module.exports = {
  toAddUserTransactions
};
