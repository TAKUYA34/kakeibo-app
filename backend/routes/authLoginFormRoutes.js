const express = require('express');
const router = express.Router();
const adminAuthMiddleware = require('../middleware/adminAuth_situation');
const adminLoginFormController = require('../controllers/adminLoginFormController');
// 管理者ログインフォームのログイン処理
router.post('/login', adminLoginFormController.adminLogin);

// 管理者ログインフォームのルーティング
router.get('/me', adminAuthMiddleware.adminOnly, adminLoginFormController.getAdminProfile);

module.exports = router;  