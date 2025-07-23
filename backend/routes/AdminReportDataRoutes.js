const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth_situation');
const adminReportDataController = require('../controllers/adminReportDataController');

router.get('/notices/all', adminAuth.adminOnly, adminReportDataController.getPaginatedAllNotices);
router.post('/notices/register', adminAuth.adminOnly, adminReportDataController.createNotice);
router.put('/notices/edit/:id', adminAuth.adminOnly, adminReportDataController.updateNotice);
router.delete('/notices/delete/:id', adminAuth.adminOnly, adminReportDataController.deleteNotice);

module.exports = router;