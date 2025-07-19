const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth_situation');
const adminReportDataController = require('../controllers/AdminReportDataController');

router.get('/notices/all', adminAuth.adminOnly, adminReportDataController.getPaginatedAllNotices);
router.post('/notices/register', adminAuth.adminOnly, adminReportDataController.createNotice);
router.put('/notices/:id', adminAuth.adminOnly, adminReportDataController.updateNotice);
router.delete('/notices/:id', adminAuth.adminOnly, adminReportDataController.deleteNotice);

module.exports = router;