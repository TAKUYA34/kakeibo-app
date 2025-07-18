const express = require('express');
const router = express.Router();
const userAuthenticate = require('../middleware/auth_situation');
const transactionController = require('../controllers/transactionAddController');

// 認証ミドルウェアが必要ならここで設定する
router.post('/add/register', userAuthenticate.authenticate, transactionController.handleTransactionAdd);

module.exports = router;