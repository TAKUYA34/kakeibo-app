const express = require('express');
const WhatsNewController = require('../controllers/whatsNewController');

/* 本番とテスト用で分けるために関数化 */
module.exports = (authMiddleware) => {
  const router = express.Router();
  router.get('/notices', authMiddleware, WhatsNewController.getNotices);

  return router;
};
