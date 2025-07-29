const passwordReEnrollmentService = require('../services/passwordReEnrollmentService');

/* 新しいパスワードに変更する */
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    await passwordReEnrollmentService.fetchResetPassword(token, newPassword);
    res.status(200).json({ message: 'パスワードがリセットされました。' });
  } catch (error) {
    // console.error('リセット失敗:', error);
    res.status(400).json({ message: error.message || 'パスワードリセットに失敗しました。' });
  }
};

module.exports = {
  resetPassword
}