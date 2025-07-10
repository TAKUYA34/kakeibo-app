const transactionListService = require('../services/transactionListService');

// 月のみ取得
const getYearsAndMonths = async (req, res) => {
  try {
    const data = await transactionListService.extractYearsAndMonths();
    res.json(data);
  } catch (error) {
    console.error('年または月の取得エラー:', error);
    res.status(500).json({ error: '年または月の取得に失敗しました'});
  }
};

// 集計したデータを取得
const getMonthlyAggregate = async (req, res) => {
  try {
    const year = parseInt(req.query.year, 10); // 例: /api/aggregate?year=2025
    const userId = req.query.userId; // ログインユーザーIDなど

    const result = await transactionListService.fetchMonthlyAggregateByCategory(year, userId);
    res.json(result);
  } catch (error) {
    console.error('集計データ取得エラー:', error);
    res.status(500).json({ error: '月別集計の取得に失敗しました' });
  }
};

module.exports = {
  getYearsAndMonths,
  getMonthlyAggregate
};
