const express = require('express');
const router = express.Router();
const passwordReEnrollmentController = require('../controllers/passwordReEnrollmentController');

router.post('/password/reset-password', passwordReEnrollmentController.resetPassword);

module.exports = router;