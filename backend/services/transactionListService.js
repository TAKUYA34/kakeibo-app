const transactionListRepository = require('../repositories/transactionListRepository');

/* 月のみ取得 */
const extractYearsAndMonths = async () => {

  try {
  const transactions = await transactionListRepository.getAllTransactionDates();

  const yearSet = new Set(); // 重複対策
  const monthSet = new Set(); // 重複対策

  transactions.forEach(tx => {
    const date = new Date(tx.trans_date); // DBからtrans_dateを取得

    if (isValidDate(tx.trans_date)) {
      yearSet.add(date.getFullYear()); // DB登録済の年を全て取得
      monthSet.add(date.getMonth() + 1); // 0対策
    }
  });

  const years = Array.from(yearSet).sort((a, b) => b - a); // 降順
  const months = Array.from(monthSet).sort((a, b) => a - b); // 昇順

  return { years, months };
  } catch (err) {
    throw new Error('DB接続失敗');
  }
};

/* invalid-dateチェック */
function isValidDate(date) {
  if (!date) return false; // null, undefined, "", 0 などを除外
  const dateInput = new Date(date);
  return dateInput instanceof Date && !isNaN(dateInput.getTime());
}

/* 集計したデータを取得 */
const fetchMonthlyAggregateByCategory = async (year, userId) => {

  if(isNaN(year)) {
    throw new Error('年は数値である必要があります');
  }

  return await transactionListRepository.aggregateMonthlyByCategory(year, userId);
}

module.exports = {
  extractYearsAndMonths,
  fetchMonthlyAggregateByCategory
};