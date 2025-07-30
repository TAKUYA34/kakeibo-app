const adminDashboardDataService = require('../services/adminDashboardDataService');

/* ユーザー全取引データを取得する */
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await adminDashboardDataService.fetchAllTransactions();
    res.status(200).json(transactions);
  } catch (err) {
    // console.error('Error getting transactions:', err);
    res.status(500).json({ message: '取引一覧の取得に失敗しました' });
  }
};

/* ユーザー名やカテゴリ、メモでキーワード検索する */
const getUserAndCategoryAndMemosSearch = async (req, res) => {
  try {
    // フィルター条件を受け取る
    const searchResults = await adminDashboardDataService.fetchUserAndCategoryAndMemosSearch(req.body);
    // console.log('form側', req.body);
    // console.log('backend側', searchResults);
    res.status(200).json(searchResults);
  } catch (err) {
    // console.error('Error getting transactions:', err);
    res.status(500).json({ message: '取引一覧の取得に失敗しました' });
  }
};

/* ユーザーの取引データを編集する */
async function getUpdateTransaction(req, res) {

  const transactionId = req.params.id;
  const updatedData = req.body;
  try {
    const updateAllUserTransactionTx = await adminDashboardDataService.updateTransactionAndRecalculateTotal(transactionId, updatedData);
    // console.log('form側', req.body);
    // console.log('backend側', updateAllUserTransactionTx);
    res.status(200).json({ message: '取引データと合計金額を更新しました', updatedData: updateAllUserTransactionTx });
  } catch (err) {
    // console.error('更新エラー:', error);
    res.status(500).json({ message: '取引の更新に失敗しました' });
  }
};

/* ユーザーの取引データを削除する */
async function getDeleteTransaction(req, res) {

  const transactionId = req.params.id;
  try {
    const deletedUpdateTransactionTx = await adminDashboardDataService.deleteTransactionAndRecalculateTotal(transactionId);
    // console.log('backend側', deletedUpdateTransactionTx);
    res.json({ message: '削除完了しました', deletedUpdateTransactionTx });
  } catch (err) {
    // console.error('削除失敗:', err);
    res.status(500).json({ message: '取引の削除に失敗しました' });
  }
};

module.exports = {
  getAllTransactions,
  getUserAndCategoryAndMemosSearch,
  getUpdateTransaction,
  getDeleteTransaction
}