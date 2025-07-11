const express = require('express');
const router = express.Router();
const currentMoneyGraphController = require('../controllers/currentMoneyGraphController');

// 認証ミドルウェアが必要ならここで設定する
router.get('/monthly', currentMoneyGraphController.getMonthlySummary);
router.get('/categories', currentMoneyGraphController.getCategorySummery);

module.exports = router;