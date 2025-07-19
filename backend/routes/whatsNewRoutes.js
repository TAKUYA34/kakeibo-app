const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth_situation'); // 認証
const WhatsNewController = require('../controllers/whatsNewController');

router.get('/notices', auth.authenticate, WhatsNewController.getNotices);

module.exports = router;