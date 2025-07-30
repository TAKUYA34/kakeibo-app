const express = require('express');
const transactionController = require('../controllers/transactionAddController');

/* 本番とテスト用で分けるために関数化 */
module.exports = (authMiddleware) => {
  const router = express.Router();
  router.post('/add/register', authMiddleware, transactionController.handleTransactionAdd);

  return router;
};