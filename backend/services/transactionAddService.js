const transactionAddRepository = require('../repositorys/TransactionAddRepository');
const { mapToTransaction } = require('../mappers/transactionAddMapper');
const { convertWarekiToDate } = require('../utils/dateUtils');

async function toAddUserTransactions(transactions, userId) {
  const txDate = new Date(); // 現在の日付を使用
  const startOfMonth = new Date(txDate.getFullYear(), txDate.getMonth(), 1); // 月の初日を取得
  const endOfMonth = new Date(txDate.getFullYear(), txDate.getMonth() + 1, 0, 23, 59, 59, 999); // 月の最終日を取得
  
  let runTotal = await transactionAddRepository.getMonthlyTotalByUser(userId, startOfMonth, endOfMonth); // 月ごとの合計を取得
  const resultTransactions = []; // 箱
  
  for (const tx of transactions) {

    let parsedDate = new Date();
    const warekiStr = tx.date;
    if (/^([RHS])(\d+)年(\d+)月(\d+)日$/.test(warekiStr)) { // 和西形式なら変換する
      parsedDate = convertWarekiToDate(warekiStr);
    } else if (!isNaN(Date.parse(warekiStr))) { // ISO文字列など正しい日付ならそのまま使用する
      parsedDate = new Date(warekiStr);
    }

    const mapped = mapToTransaction({...tx, date: parsedDate }, userId, runTotal); // マッピング
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