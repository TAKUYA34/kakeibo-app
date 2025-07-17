const adminLoginFormService = require('../services/adminLoginFormService');

const getAdminProfile = async (req, res) => {
  try {
    // 管理者のユーザープロフィールを取得
    const user = await adminLoginFormService.fetchAdminProfile(req.user);
    console.log("Admin profile request:", req.user);
    console.log("Admin profile fetched:", user);
    if (!user) {
      return res.status(403).json({ message: '管理者認証に失敗しました' });
    }
    res.json({ user });
  } catch (error) {
    console.error('管理者情報取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラー' });
  }
};

const adminLogin = async (req, res) => {
  // 管理者ログインのメールアドレスとパスワードを取得
  const { email, password } = req.body;

  try {
    const result = await adminLoginFormService.loginAdminUser(email, password);
    res.json(result);
    console.log("Login successful:", result);
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(401).json({ message: "認証失敗: " + err.message });
  }
};

module.exports = { adminLogin };

module.exports = {
  getAdminProfile,
  adminLogin
};