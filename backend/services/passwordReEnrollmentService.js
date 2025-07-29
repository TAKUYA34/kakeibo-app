const passwordReEnrollmentRepository = require('../repositories/passwordReEnrollmentRepository');
const bcrypt = require('bcrypt');

/* 新しいパスワードをハッシュ化して再登録する */
const fetchResetPassword = async (token, newPassword) => {

  try {
    //照合
    const user = await passwordReEnrollmentRepository.findByResetToken(token);

    if (!user) {
      throw new Error('無効なトークンです。');
    }
    // ハッシュ化
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // パスワードとトークンを更新
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    
    // 登録する
    await user.save();
  } catch (err) {
    throw err;
  }
};

module.exports = {
  fetchResetPassword
}