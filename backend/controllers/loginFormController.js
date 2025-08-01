const loginFormService = require('../services/loginFormService');

/* 登録ユーザーのログインチェック */
const login = async (req, res) => {
  const { email, password } = req.body;
  
  // メールとパスワードが未入力または空の場合
  if (!email || !password)
    return res.status(400).json({ message: 'メールアドレスとパスワードを入力してください。' });

  try {
    const token = await loginFormService.login(email, password);
    res.status(200).json({ token });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

/* 登録ユーザーのログアウトチェック */
const logout = async (req, res) => {
  try {
    await loginFormService.logout(req.user.id);
    res.status(200).json({ message: 'ログアウトしました' });
  } catch (err) {
    // console.log(err.message);
    res.status(500).json({ message: 'ログアウト処理中にエラーが発生しました' });
  }
};

/* token認証後にユーザーのデータを取得する */
const getMyInfo = async (req, res) => {
  try {
    const user = await loginFormService.getMyInfo(req.user.id);
    // console.log('ユーザーデータ取得後', user);
    res.json(user);
  } catch (err) {
    // console.log(err.message);
    res.status(500).json({ message: 'サーバーエラー' });
  }
};

/* 管理者がtoken認証後に一般ユーザーのデータを取得する */
const getAllUsers = async (req, res) => {
  try {
    const users = await loginFormService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'サーバーエラー' });
  }
};

module.exports = {
  login,
  logout,
  getMyInfo,
  getAllUsers
}