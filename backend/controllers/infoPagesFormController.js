const infoPagesFormService = require('../services/infoPagesFormService');

/* formから問い合わせ内容を受け取る */
const sendContactEmail = async (req, res) => {
  const { name, email, message, subject } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: '全ての項目を入力してください。' });
  }

  try {
    const previewUrl = await infoPagesFormService.sendContactEmailService({name, email, message, subject});

    console.log('メール送信成功:', previewUrl);

    return res.status(200).json({ message: 'メールを送信しました。' });
  } catch (err) {
    // console.error('メール送信失敗:', err);
    return res.status(500).json({ error: 'メール送信に失敗しました。' });
  }
};

module.exports = {
  sendContactEmail
}