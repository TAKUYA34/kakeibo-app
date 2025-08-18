const adminLoginFormService = require('../services/adminLoginFormService');

/* 管理者ログイン成功時、管理者のデータを取得する */
const getAdminProfile = async (req, res) => {
  try {
    // 管理者のユーザープロフィールを取得
    const user = await adminLoginFormService.fetchAdminProfile(req.user);
    console.log('管理者データ', user);
    if (!user) {
      return res.status(403).json({ message: '管理者認証に失敗しました' });
    }
    res.json({ user });
  } catch (error) {
    console.error('管理者情報取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラー' });
  }
};

/* 管理者の登録データを検索する */
const adminLogin = async (req, res) => {
  // 管理者ログインのメールアドレスとパスワードを取得
  const { email, password } = req.body;

  try {
    const result = await adminLoginFormService.loginAdminUser(email, password);

    // トークンをCookieにセットする
    res.cookie('admin_token', result.token, {
      httpOnly: true, // JSでアクセス不可にする (XSS対策)
      secure: process.env.NODE_ENV === 'production', // httpsのみ許可する
      sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax', // 他のサイトからのリクエストでCookieを返さない (CSRF対策)
      maxAge: 2 * 60 * 60 * 1000 // 2時間まで有効
    });

    // レスポンスはユーザー情報のみ返す
    res.status(200).json({
      message: 'ログイン成功しました',
      user: result.user
    });

    // console.log("Login successful:", result);
  } catch (err) {
    console.error("Login error:", err.message);
    if (err.code === 'ADMIN_NOT_FOUND' || err.code === 'INVALID_PASSWORD') {
      res.status(401).json({ message: "認証失敗: " + err.message });
    } else {
      res.status(500).json({ message: 'サーバーエラー'});
    }
  }
};

/* 管理者ログアウト */
const logoutAdmin = async (req, res) => {

  try {
    // 管理者のログアウト処理を実行
    await adminLoginFormService.logoutAdminUser(req.user.id);

    // Cookieからトークンを削除
    res.clearCookie('admin_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax'
    });

    res.status(200).json({ message: '管理者ログアウトしました' });
  } catch (err) {
    res.status(500).json({ message: '管理者ログアウト処理中にエラーが発生しました' });
  }
};

module.exports = {
  getAdminProfile,
  adminLogin,
  logoutAdmin
};