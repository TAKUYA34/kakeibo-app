const transactionAddRepository = require('../repositories/transactionAddRepository');
const transactionAddMapper = require('../mappers/transactionAddMapper');

/* 月毎に合計金額を集計し、家計簿データを登録する */
async function toAddUserTransactions(transactions, userId) {
  const resultTransactions = []; // 箱
  let runTotalMap = {}; // 月ごとの合計を記録する（key: '2025-01'）

  try {
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

        // console.log('lastTotal', lastTotal);
        // lastTotal? = null や undefined のときは undefined を返す
        // total_amount?? = 左側の値が null または undefined のときだけ 0 を出力する
        runTotalMap[yearMonthKey] = lastTotal?.total_amount ?? 0;
      }
      // 金額を加算
      const currentAmount = Number(tx.amount);
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
      
      // カテゴリの取得に失敗した場合
      if (!category || !category._id) {
        throw new Error('カテゴリ取得に失敗しました');
      }

      // Transaction コンバート
      const mapped = transactionAddMapper.mapToTransaction(tx, userId, currentTotal, category._id); // 累計、IDのみ渡す
      resultTransactions.push(mapped);

      // 正常にコンバートできていない場合
      if (!mapped) {
        throw new Error('mapped失敗');
      }

      // 月ごとの合計も更新しておく
      runTotalMap[yearMonthKey] = currentTotal;
    }
        
    // 保存
    const savedata = await transactionAddRepository.insertMany(resultTransactions);
    // console.log('savedata', savedata);

    // 最後の月の合計を返す
    const latestTx = resultTransactions[resultTransactions.length - 1];
    const latestDate = latestTx.trans_date;
    const latestKey = `${latestDate.getFullYear()}-${String(latestDate.getMonth() + 1).padStart(2, '0')}`;
    const initialTotal = runTotalMap[latestKey];

    return { initialTotal, saved: savedata };
  } catch (err) {
    throw err;
  }
}

module.exports = {
  toAddUserTransactions
};
