const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionAddController');

// 認証ミドルウェアが必要ならここで設定する
router.post('/add/register', transactionController.handleTransactionAdd);

module.exports = router;