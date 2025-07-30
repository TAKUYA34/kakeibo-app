const transactionSummaryRepository = require('../repositories/currentMoneyGraphRepository');

/* 棒グラフ用家計簿データを取得する */
async function getMonthlySummary(userId) {
  return await transactionSummaryRepository.aggregateMonthlySummary(userId);
}

/* 円グラフ用家計簿データをカテゴリ毎に取得する */
async function getCategorySummary(userId) {
  return await transactionSummaryRepository.aggregateCategorySummary(userId);
}

module.exports = {
  getMonthlySummary,
  getCategorySummary
};