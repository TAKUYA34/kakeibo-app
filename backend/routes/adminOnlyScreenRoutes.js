const express = require('express');
const router = express.Router();
const AdminOnlyScreenContainer = require('../controllers/adminOnlyScreenController');
const AdminScreenAuth = require('../middleware/adminAuth_situation');

router.get('/home/stats', AdminScreenAuth.adminOnly, AdminOnlyScreenContainer.UserAllStatsData);
router.get('/home/data', AdminScreenAuth.adminOnly, AdminOnlyScreenContainer.UserAllSelectData);

module.exports = router;