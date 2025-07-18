// routes/transaction.js

const express = require('express');
const router = express.Router();
const userAuthenticate = require('../middleware/auth_situation');
const transactionListController = require('../controllers/transactionListController');

// 年と月の一覧を取得するエンドポイント
router.get('/list', userAuthenticate.authenticate, transactionListController.getYearsAndMonths);
router.get('/list/aggregate', userAuthenticate.authenticate, transactionListController.getMonthlyAggregate);

module.exports = router;
