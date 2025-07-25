const User = require('../models/User');

/* tokenをリセットする */
const findByResetToken = async (token) => {
  const now = new Date();
  return await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: now }, // トークンが有効期限内かチェック
  });
};

module.exports = {
  findByResetToken
}