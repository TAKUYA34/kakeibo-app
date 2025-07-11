const transactionSummaryRepository = require('../repositorys/currentMoneyGraphRepository');

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