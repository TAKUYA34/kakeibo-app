const transactionAddRepository = require('../repositories/transactionAddRepository');
const transactionAddMapper = require('../mappers/transactionAddMapper');

async function toAddUserTransactions(transactions, userId) {
  const resultTransactions = []; // 箱
  let runTotalMap = {}; // 月ごとの合計を記録する（key: '2025-01'）

  // 日付昇順にソートする
  transactions.sort((a, b) => new Date(a.trans_date) - new Date(b.trans_date));

  for (const tx of transactions) {
    // nullチェック
    // console.log('[tx チェック]', tx);
    const txDate = new Date(tx.trans_date); // 各取引の日付
    const yearMonthKey = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`; // 2025-04-12

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
    
    // 収支 or 支出
    const trans_type = tx.major === 'income' ? 'income' : 'expense';

    // カテゴリ取得
    const category = await transactionAddRepository.findOrCreateCategory(
      userId,
      trans_type,
      tx.major, // 'income' or 'expense'
      tx.middle,
      tx.minor || ''
    );

    // Transaction コンバート
    const mapped = transactionAddMapper.mapToTransaction(tx, userId, currentTotal, category._id); // 累計、IDのみ渡す
    resultTransactions.push(mapped);

    // 月ごとの合計も更新しておく
    runTotalMap[yearMonthKey] = currentTotal;
  }
  
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
