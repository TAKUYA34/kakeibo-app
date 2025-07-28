const express = require('express');
const router = express.Router();
const infoPagesFormController = require('../controllers/infoPagesFormController');

router.post('/contact', infoPagesFormController.sendContactEmail);

module.exports = router;