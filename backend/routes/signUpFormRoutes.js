const express = require('express');
const router = express.Router();
const signUpFormController = require('../controllers/signUpFormController');

router.post('/register', signUpFormController.register);

module.exports = router;