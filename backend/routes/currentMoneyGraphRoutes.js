const express = require('express');
const router = express.Router();
const currentMoneyGraphController = require('../controllers/currentMoneyGraphController');

router.get('/monthly', currentMoneyGraphController.getMonthlySummary);
router.get('/categories', currentMoneyGraphController.getCategorySummery);

module.exports = router;