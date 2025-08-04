const adminDashboardDataRepository = require('../repositories/adminDashboardDataRepository');

/*-- ユーザー全取引データを取得する --*/
const fetchAllTransactions = async () => {
  return await adminDashboardDataRepository.findAllTransactions();
};

/*-- ユーザー名やカテゴリ、メモでキーワード検索する --*/
const fetchUserAndCategoryAndMemosSearch = async (filters) => {

  if (!filters) {
    throw new Error('データの取得に失敗しました');
  }

  const refinedFilters = {
    // Stringで受け取ってるか
    name: typeof filters.name === 'string' ? filters.name.trim() : null,
    
    // String（単一検索）のみ
    category_major: typeof filters.category_major === 'string' && filters.category_major.trim()
    ? filters.category_major.trim() : null,

    // String（単一検索）OR 配列（複数検索）に対応する
    category_middle: Array.isArray(filters.category_middle)
      ? filters.category_middle.filter(v => typeof v === 'string' && v.trim()).map(v => v.trim())
      : typeof filters.category_middle === 'string' && filters.category_middle.trim()
      ? [filters.category_middle.trim()]
      : [],

    category_minor: Array.isArray(filters.category_minor)
      ? filters.category_minor.filter(v => typeof v === 'string' && v.trim()).map(v => v.trim())
      : typeof filters.category_minor === 'string' && filters.category_minor.trim()
      ? [filters.category_minor.trim()]
      : [],

    trans_date: typeof filters.trans_date === 'string' && filters.trans_date.trim()
      ? filters.trans_date.trim() : null,

    memo: Array.isArray(filters.memo)
      ? filters.memo.filter(v => typeof v === 'string' && v.trim()).map(v => v.trim())
      : typeof filters.memo === 'string' && filters.memo.trim()
      ? [filters.memo.trim()]
      : []  };

    return await adminDashboardDataRepository.keywordSearchTransactions(refinedFilters);
  };
    
/*-- ユーザーの取引データを編集する --*/
async function updateTransactionAndRecalculateTotal(id, updatedData) {

  /* 対象の取引データを取得 */
  const originalTransaction = await adminDashboardDataRepository.findTransactionById(id);
  if (!originalTransaction) throw new Error('取引するデータがありません');

  /* 取引を更新する */
  await adminDashboardDataRepository.updateTransactionById(id, updatedData);

  // 日付データを格納
  const userId = originalTransaction.user_id;
  const originalDate = new Date(originalTransaction.trans_date);

  // 例：2025-07-01 ~ 2025-07-31
  const monthStart = new Date(originalDate.getFullYear(), originalDate.getMonth(), 1);
  const monthEnd = new Date(originalDate.getFullYear(), originalDate.getMonth() + 1, 0, 23, 59, 59, 999);
  
  /* 取引を更新した後に同じ月の全取引を取得 */
  const monthTransactions = await adminDashboardDataRepository.findMonthlyTransactions(userId, monthStart, monthEnd);

  // total_amount を再計算
  let runningTotal = 0;
  const bulkOps = monthTransactions.map(tx => {
    runningTotal += tx.amount;
    return {
      updateOne: {
        filter: { _id: tx._id },
        update: { $set: { total_amount: runningTotal } }
      }
    };
  });

  /* DB一括更新 */
  await adminDashboardDataRepository.bulkUpdateAndDeleteTotalAmounts(bulkOps);

  /* 更新された1件を取得（ユーザーIDを知るため）*/
  const updatedTx = await adminDashboardDataRepository.findTransactionById(id);

  const updateUserId = updatedTx.user_id;

  /* 更新後の最新取引データを再取得 */
  const allUserTransactionsTx = await adminDashboardDataRepository.findAllTransactionsByUserId(updateUserId);
  return allUserTransactionsTx;
}

/*-- ユーザーの取引データを削除する --*/
async function deleteTransactionAndRecalculateTotal(id) {

  /* 対象の削除データを取得 */
  const targetTransaction = await adminDashboardDataRepository.findTransactionById(id);
  if (!targetTransaction) throw new Error("取引するデータがありません");

  // 削除データを格納
  const userId = targetTransaction.user_id;
  const targetDate = new Date(targetTransaction.trans_date);

  /* 削除する */
  await adminDashboardDataRepository.deleteTransactionById(id);

  /* 削除後、同じ月の全取引を取得 */
  const monthTransactions = await adminDashboardDataRepository.deleteAfterGetMonthTransactions(userId, targetDate);

  // total_amount を再計算
  let runningTotal = 0;
  const bulkOps = monthTransactions.map(tx => {
    runningTotal += tx.amount;
    return {
      updateOne: {
        filter: { _id: tx._id },
        update: { $set: { total_amount: runningTotal } }
      }
    };
  });

  /* DB一括更新 */
  await adminDashboardDataRepository.bulkUpdateAndDeleteTotalAmounts(bulkOps);

  /* 削除後の最新取引データを再取得 */
  const allUserTransactionsTx = await adminDashboardDataRepository.findAllTransactionsByUserId(userId);
  return allUserTransactionsTx;

}

module.exports = {
  fetchAllTransactions,
  fetchUserAndCategoryAndMemosSearch,
  updateTransactionAndRecalculateTotal,
  deleteTransactionAndRecalculateTotal
}