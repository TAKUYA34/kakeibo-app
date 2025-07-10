const transactionListRipository = require('../repositorys/transactionListRepository');

const extractYearsAndMonths = async () => {
  const transactions = await transactionListRipository.getAllTransactionDates();

  const yearSet = new Set(); // 重複対策
  const monthSet = new Set(); // 重複対策

  transactions.forEach(tx => {
    const date = new Date(tx.trans_date); // DBからtrans_dateを取得

    if (!isNaN(date)) {
      yearSet.add(date.getFullYear()); // DB登録済の年を全て取得
      monthSet.add(date.getMonth() + 1); // 0対策
    }
  });

  const years = Array.from(yearSet).sort((a, b) => b - a); // 降順
  const months = Array.from(monthSet).sort((a, b) => a - b); // 昇順

  return { years, months };
};

// aggregate 集計処理
const fetchMonthlyAggregateByCategory = async (year, userId) => {
  return await transactionListRipository.aggregateMonthlyByCategory(year, userId);
}

module.exports = {
  extractYearsAndMonths,
  fetchMonthlyAggregateByCategory
};