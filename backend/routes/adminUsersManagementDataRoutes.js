const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth_situation');
const adminUsersManagementDataController = require('../controllers/adminUsersManagementDataController');

router.get('/home/users', adminAuth.adminOnly, adminUsersManagementDataController.getAllNonAdminUsers);
router.post('/home/users/search', adminAuth.adminOnly, adminUsersManagementDataController.getUsersByName);
router.put('/home/users/edit/:id', adminAuth.adminOnly, adminUsersManagementDataController.updateUserComplete);
router.delete('/home/users/delete/:id', adminAuth.adminOnly, adminUsersManagementDataController.deleteUserComplete);

module.exports = router;  