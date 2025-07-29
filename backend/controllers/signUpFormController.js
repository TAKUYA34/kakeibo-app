const signUpFormService = require('../services/signUpFormService');

/* 新規ユーザーの登録をする */
const register = async (req, res) => {
  // formからデータを取得
  const { user_name, email, password } = req.body;

  // データ未入力または空の場合
  if (!user_name || !email || !password)
    return res.status(400).json({ message: '全てのフィールドを入力してください。' });

  try {
    await signUpFormService.register({ user_name, email, password });
    res.status(201).json({ message: 'ユーザー登録成功' });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

module.exports = {
  register
}