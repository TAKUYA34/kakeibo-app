const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth_situation');
const profileController = require('../controllers/profileEditController');

router.put('/profile/edit', authenticateToken.authenticate, profileController.updateProfile);
router.delete('/profile/delete', authenticateToken.authenticate, profileController.deleteProfile);
module.exports = router;