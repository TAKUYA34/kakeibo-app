const nodemailer = require('nodemailer');

/* メールサーバー宛に送信する処理 */
const sendContactEmailService = async ({ name, email, message, subject }) => {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//       user: process.env.ETHEREAL_USER,
//       pass: process.env.ETHEREAL_PASS,
//     },
//   });

  // 一時的なアカウントを自動生成
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
    to: process.env.ETHEREAL_USER,
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
  return nodemailer.getTestMessageUrl(info); // 表示リンクを返す（ログ用）
};

module.exports = {
  sendContactEmailService
};