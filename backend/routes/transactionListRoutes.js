const express = require('express');
const transactionListController = require('../controllers/transactionListController');

/* 本番とテスト用で分けるために関数化 */
module.exports = (authMiddleware) => {
  const router = express.Router();
  // 年と月の一覧を取得するエンドポイント
  router.get('/list', authMiddleware, transactionListController.getYearsAndMonths);
  router.get('/list/aggregate', authMiddleware, transactionListController.getMonthlyAggregate);

  return router;
}
