/* mailer.js */
const nodemailer = require('nodemailer'); // メール生成用パッケージ

/* 指定したemailにリセットメールを送信する */
const sendTestResetEmail = async (toEmail, resetLink) => {
  try {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    // この形式でメールを送信する
    const mailOptions = {
      from: '"Kakeibo App" <no-reply@kakeibo.com>',
      to: toEmail,
      subject: 'パスワードリセット',
      text: `以下のリンクからパスワードをリセットできます：\n\n${resetLink}`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('送信成功！');
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error('メール送信中にエラー:', err);
  }
};

module.exports = {
  sendTestResetEmail
}