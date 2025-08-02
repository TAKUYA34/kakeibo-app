const express = require('express');
const router = express.Router();
const adminLoginFormController = require('../controllers/adminLoginFormController');

// 管理者ログインフォームのログイン処理
router.post('/login', adminLoginFormController.adminLogin);

/* 本番とテスト用で分けるために関数化 */
module.exports = (adminAuthMiddleware) => {
  // 管理者ログインフォームのルーティング
  router.get('/me', adminAuthMiddleware, adminLoginFormController.getAdminProfile);

  return router;
};