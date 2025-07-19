const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportPDFAndCSVController');
const auth = require('../middleware/auth_situation');

router.get('/export', auth.authenticate, exportController.exportData);
router.get('/date-options', auth.authenticate, exportController.getDateOptions);

module.exports = router;