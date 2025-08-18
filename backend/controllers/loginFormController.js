const loginFormService = require('../services/loginFormService');

/* 登録ユーザーのログインチェック */
const login = async (req, res) => {
  const { email, password } = req.body;

  // メールとパスワードが未入力または空の場合
  if (!email || !password)
    return res.status(400).json({ message: 'メールアドレスとパスワードを入力してください。' });

  try {
    const result = await loginFormService.login(email, password);

    // トークンをCookieにセットする
    res.cookie('user_token', result.token, {
      httpOnly: true, // JSでアクセス不可にする (XSS対策)
      secure: process.env.NODE_ENV === 'production', // httpsのみ許可する
      sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax', // 他のサイトからのリクエストでCookieを返さない (CSRF対策)
      maxAge: 60 * 60 * 1000 // １時間まで有効
    });

    res.status(200).json({ result, message: 'ログイン成功しました' });
    // console.log('result', result );
  } catch (err) {
      console.log(err.message);
    if (err.code === 'USER_NOT_FOUND' || err.code === 'INVALID_PASSWORD') {
      return res.status(401).json({ message: err.message });
    }
    return res.status(500).json({ message: 'サーバーエラー' });
  }
};

/* 登録ユーザーのログアウトチェック */
const logout = async (req, res) => {
  try {
    await loginFormService.logout(req.user.id);

    // Cookieを削除
    res.clearCookie('user_token', {
      httpOnly: true, // JSでアクセス不可にする (XSS対策)
      secure: process.env.NODE_ENV === 'production', // httpsのみ許可する
      sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax' // 他のサイトからのリクエストでCookieを返さない (CSRF対策)
    });

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
    // console.log(err.message);
    res.status(500).json({ message: 'サーバーエラー' });
  }
};

module.exports = {
  login,
  logout,
  getMyInfo,
  getAllUsers
}