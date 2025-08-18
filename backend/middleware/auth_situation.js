// middleware/auth_situation.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// ユーザーチェック
const authenticate = (req, res, next) => {
  // Cookieから取得
  const user_token = req.cookies?.user_token;

  if (!user_token) return res.sendStatus(401);

  try {
    // トークンの検証
    const decoded = jwt.verify(user_token, JWT_SECRET);
    req.user = decoded; // { email, id, role }
    next();
  } catch (err) {
    // console.error('JWT verification error:', err);
    return res.sendStatus(403); // トークンが無効または期限切れ
  }
};

// 追加：管理者チェックミドルウェア
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: '管理者権限が必要です' });
  }
};

module.exports = { authenticate, isAdmin };