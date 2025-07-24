const requestPasswordResetService = require('../services/requestPasswordResetService');

/* formからメールアドレスを受け取る */
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body; // email受信
    await requestPasswordResetService.handlePasswordResetRequest(email);
    return res.status(200).json({ message: 'リセットメールを送信しました' });
  } catch (err) {
    console.error('リセットリクエスト失敗', err);
    return res.status(500).json({ message: 'リセットメール送信に失敗しました' });
  }
};

module.exports = {
  requestPasswordReset
}