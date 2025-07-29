const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/auth_situation');
const loginFormController = require('../controllers/loginFormController');

router.post('/login', loginFormController.login);
router.post('/logout/flag', authenticate, loginFormController.logout);
router.get('/me', authenticate, loginFormController.getMyInfo);
router.get('/admin/users', authenticate, isAdmin, loginFormController.getAllUsers);

module.exports = router;