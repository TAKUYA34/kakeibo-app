const crypto = require('crypto'); // token生成
const requestPasswordResetRepository = require('../repositories/requestPasswordResetRepository');
const sendResetEmail = require('../utils/mailer');

/* 指定したユーザーのメールチェック */
const handlePasswordResetRequest = async (email) => {
  try {
    const user = await requestPasswordResetRepository.findByEmail(email);
    if (!user) throw new Error('ユーザーが見つかりません');

    // トークン生成
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 3600000; // 1時間

    await requestPasswordResetRepository.updateResetToken(user._id, token, expires);

    // tokenをSMTPサーバーに送る
    const resetLink = `http://localhost:3000/home/login/password/reset/confirm?token=${token}`;
    await sendResetEmail.sendTestResetEmail(user.email, resetLink);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  handlePasswordResetRequest
}