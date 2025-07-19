const transactionSummaryRepository = require('../repositories/currentMoneyGraphRepository');

async function getMonthlySummary(userId) {
  return await transactionSummaryRepository.aggregateMonthlySummary(userId);
}

async function getCategorySummary(userId) {
  return await transactionSummaryRepository.aggregateCategorySummary(userId);
}

module.exports = {
  getMonthlySummary,
  getCategorySummary
};