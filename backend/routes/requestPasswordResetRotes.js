const express = require('express');
const router = express.Router();
const requestPasswordResetController = require('../controllers/requestPasswordResetController');

router.post('/password/reset', requestPasswordResetController.requestPasswordReset);

module.exports = router;