const nodemailer = require('nodemailer');
// const path = require('path');
// const dotenv = require('dotenv');

// // 本番環境 or 開発環境
// if (process.env.NODE_ENV !== 'production') {
//   dotenv.config({ path: path.resolve(__dirname, '.env.development') });
// } else {
//   dotenv.config({ path: path.resolve(__dirname, '.env.production') });
// }

/* Gmail宛に送信する処理 */
const sendContactEmailService = async ({ name, email, message, subject }) => {
  // const transporter = nodemailer.createTransport({
  //   /* 本番環境用 */
  //   service: 'gmail',
  //   auth: {
  //     user: process.env.GMAIL_USER,
  //     pass: process.env.GMAIL_PASS
  //   },
  // });

  // 開発用アカウントを自動生成
  const testAccount = await nodemailer.createTestAccount();

  // etherealサーバーにアクセス
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // メールの形式
  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.GMAIL_USER,
    subject: `【Kakeibo-App お問い合わせ】【${subject}】 ${name} 様より`,
    text: `【お名前】
    ${name}
    【メールアドレス】
    ${email}
    【お問い合わせ内容】
    ${message}`.trim()
  };

  // 送信
  const info = await transporter.sendMail(mailOptions);
  return info.messageId;
  // return nodemailer.getTestMessageUrl(info); // 表示リンクを返す（ログ用）
};

module.exports = {
  sendContactEmailService
};