const express = require('express');
const loginFormController = require('../controllers/loginFormController');

/* 本番とテスト用で分けるために関数化 */
module.exports = ({ authenticate, isAdmin }) => {
  const router = express.Router();
  router.post('/login', loginFormController.login);
  router.post('/logout/flag', authenticate, loginFormController.logout);
  router.get('/me', authenticate, loginFormController.getMyInfo);
  router.get('/admin/users', authenticate, isAdmin, loginFormController.getAllUsers);

  return router;
};