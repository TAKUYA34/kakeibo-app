const express = require('express');
const profileController = require('../controllers/profileEditController');

/* 本番とテスト用で分けるために関数化 */
module.exports = (authMiddleware) => {
  const router = express.Router();
  router.put('/profile/edit', authMiddleware, profileController.updateProfile);
  router.delete('/profile/delete', authMiddleware, profileController.deleteProfile);
  
  return router;
};