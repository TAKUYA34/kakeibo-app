const express = require('express');
const adminDashboardDataController = require('../controllers/adminDashboardDataController');

/* 本番とテスト用で分けるために関数化 */
module.exports = (adminAuthMiddleware) => {
  const router = express.Router();
  router.get('/home/dashboard', adminAuthMiddleware, adminDashboardDataController.getAllTransactions);
  router.post('/home/dashboard/search', adminAuthMiddleware, adminDashboardDataController.getUserAndCategoryAndMemosSearch);
  router.put('/home/dashboard/edit/:id', adminAuthMiddleware, adminDashboardDataController.getUpdateTransaction);
  router.delete('/home/dashboard/delete/:id', adminAuthMiddleware, adminDashboardDataController.getDeleteTransaction);

  return router;
};