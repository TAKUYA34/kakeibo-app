const express = require('express');
const adminReportDataController = require('../controllers/adminReportDataController');

/* 本番とテスト用で分けるために関数化 */
module.exports = (adminAuthMiddleware) => {
  const router = express.Router();
  router.get('/notices/all', adminAuthMiddleware, adminReportDataController.getPaginatedAllNotices);
  router.post('/notices/register', adminAuthMiddleware, adminReportDataController.createNotice);
  router.put('/notices/edit/:id', adminAuthMiddleware, adminReportDataController.updateNotice);
  router.delete('/notices/delete/:id', adminAuthMiddleware, adminReportDataController.deleteNotice);

  return router;
};