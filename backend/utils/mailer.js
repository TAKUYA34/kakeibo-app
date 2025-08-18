/* mailer.js */
const nodemailer = require('nodemailer'); // メール生成用パッケージ
// const path = require('path');
const dotenv = require('dotenv');

// // 本番環境 or 開発環境
// if (process.env.NODE_ENV !== 'production') {
//   dotenv.config({ path: path.resolve(__dirname, '../.env.development') });
// } else {
//   dotenv.config({ path: path.resolve(__dirname, '../.env.production') });
// }

/* 指定したemailにリセットメールを送信する */
const sendTestResetEmail = async (toEmail, resetLink) => {
  try {
    /* テスト用 */
    // const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      /* 本番用 */
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      },

      // /* テスト用 */
      // host: 'smtp.ethereal.email',
      // port: 587,
      // auth: {
      //   user: testAccount.user,
      //   pass: testAccount.pass
      // }
    });

    // この形式でメールを送信する
    const mailOptions = {
      from: '"Kakeibo App" <no-reply@kakeibo.com>',
      to: toEmail,
      subject: 'パスワードリセット',
      text: `以下のリンクからパスワードをリセットできます：\n\n${resetLink}`,
    };

    const info = await transporter.sendMail(mailOptions);

    // console.log('送信成功！');
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error('メール送信中にエラー:', err);
  }
};

module.exports = {
  sendTestResetEmail
}