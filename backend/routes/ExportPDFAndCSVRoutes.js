const express = require('express');
const exportController = require('../controllers/exportPDFAndCSVController');

/* 本番とテスト用で分けるために関数化 */
module.exports = (authMiddleware) => {
  const router = express.Router();
  router.get('/export', authMiddleware, exportController.exportData);
  router.get('/date-options', authMiddleware, exportController.getDateOptions);

  return router;
};