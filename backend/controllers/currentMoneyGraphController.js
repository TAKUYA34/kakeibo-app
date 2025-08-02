const transactionSummaryService = require('../services/currentMoneyGraphService');

/* 棒グラフ用家計簿データを取得する */
async function getMonthlySummary(req, res) {
  try {
    const userId = req.query.userId; // userId
    // console.log('userID', userId);
    if (!userId) return res.status(400).json({ message: 'userIdが必要です' });

    const summary = await transactionSummaryService.getMonthlySummary(userId);
    res.json(summary);
  } catch (err) {
    // console.error('[getMonthlySummary] error:', err);
    res.status(500).json({ message: '集計失敗', error: err.message });
  }
}

/* 円グラフ用家計簿データをカテゴリ毎に取得する */
async function getCategorySummery(req, res) {
  try {
    const userId = req.query.userId; // userId
    // console.log('userID', userId);
    if (!userId) return res.status(400).json({ message: 'userIdが必要です' });

    const summary = await transactionSummaryService.getCategorySummary(userId);
    // console.log(summary);
    res.json(summary);
  } catch (err) {
    // console.error('[getMonthlySummary] error:', err);
    res.status(500).json({ message: '集計失敗', error: err.message });
  }
}
  
module.exports = {
  getMonthlySummary,
  getCategorySummery
};