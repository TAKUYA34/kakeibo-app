// routes/transaction.js

const express = require('express');
const router = express.Router();
const transactionListController = require('../controllers/transactionListController');

// 年と月の一覧を取得するエンドポイント
router.get('/list', transactionListController.getYearsAndMonths);
router.get('/list/aggregate', transactionListController.getMonthlyAggregate);

module.exports = router;
