const express = require('express');
const adminUsersManagementDataController = require('../controllers/adminUsersManagementDataController');

/* 本番とテスト用で分けるために関数化 */
module.exports = (adminAuthMiddleware) => {
  const router = express.Router();
  router.get('/home/users', adminAuthMiddleware, adminUsersManagementDataController.getAllNonAdminUsers);
  router.post('/home/users/search', adminAuthMiddleware, adminUsersManagementDataController.getUsersByName);
  router.put('/home/users/edit/:id', adminAuthMiddleware, adminUsersManagementDataController.updateUserComplete);
  router.delete('/home/users/delete/:id', adminAuthMiddleware, adminUsersManagementDataController.deleteUserComplete);

  return router;
};