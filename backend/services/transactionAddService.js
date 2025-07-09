const transactionAddRepository = require('../repositorys/transactionAddRepository');
const { mapToTransaction } = require('../mappers/transactionAddMapper');
const { convertWarekiToDate } = require('../utils/dateUtils');

async function toAddUserTransactions(transactions, userId) {
  const txDate = new Date(); // 現在の日付を使用
  const startOfMonth = new Date(txDate.getFullYear(), txDate.getMonth(), 1); // 月の初日を取得
  const endOfMonth = new Date(txDate.getFullYear(), txDate.getMonth() + 1, 0, 23, 59, 59, 999); // 月の最終日を取得
  
  let runTotal = await transactionAddRepository.getMonthlyTotalByUser(userId, startOfMonth, endOfMonth); // 月ごとの合計を取得
  const resultTransactions = []; // 箱
  
  for (const tx of transactions) {
    const mapped = mapToTransaction(tx, userId, runTotal); // マッピング
    resultTransactions.push(mapped); // 結果を配列に追加する
    runTotal += mapped.amount; // マッピングされたトランザクションの金額を合計に加算
  }
  
  let initialTotal = runTotal; // 合計を保存

  // Mongooseのモデルに自動でマッピングされるので、ここでは直接保存
  await transactionAddRepository.insertMany(resultTransactions); // ← insertMany で一括保存
  return { initialTotal, saved: resultTransactions }; // 初期合計と保存されたトランザクションを返す
}

module.exports = {
  toAddUserTransactions
};