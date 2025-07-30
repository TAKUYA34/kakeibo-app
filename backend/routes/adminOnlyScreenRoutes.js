const express = require('express');
const AdminOnlyScreenContainer = require('../controllers/adminOnlyScreenController');

/* 本番とテスト用で分けるために関数化 */
module.exports = (adminAuthMiddleware) => {
  const router = express.Router();
  router.get('/home/stats', adminAuthMiddleware, AdminOnlyScreenContainer.UserAllStatsData);
  router.get('/home/data', adminAuthMiddleware, AdminOnlyScreenContainer.UserAllSelectData);

  return router;
};