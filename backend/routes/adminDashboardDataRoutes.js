const express = require('express');
const router = express.Router();
const AdminScreenAuth = require('../middleware/adminAuth_situation');
const adminDashboardDataController = require('../controllers/adminDashboardDataController');

router.get('/home/dashboard', AdminScreenAuth.adminOnly, adminDashboardDataController.getAllTransactions);
router.post('/home/dashboard/search', AdminScreenAuth.adminOnly, adminDashboardDataController.getUserAndCategoryAndMemosSearch);
router.put('/home/dashboard/edit/:id', AdminScreenAuth.adminOnly, adminDashboardDataController.getUpdateTransaction);
router.delete('/home/dashboard/delete/:id', AdminScreenAuth.adminOnly, adminDashboardDataController.getDeleteTransaction);

module.exports = router;