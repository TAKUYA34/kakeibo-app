const User = require('../models/User');

/* 指定したユーザーのメールチェック */
const findByEmail = async (email) => {
  return await User.findOne({ email });
};

/* リセットリンクを送信する */
const updateResetToken = async (userId, token, expires) => {
  return await User.updateOne(
    { _id: userId },
    {
      $set: {
        resetPasswordToken: token,
        resetPasswordExpires: new Date(expires),
      },
    }
  );
};

module.exports = {
  findByEmail,
  updateResetToken
}