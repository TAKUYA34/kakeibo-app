// middleware/adminAuth_situation.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;

// 管理者専用のミドルウェア user.role が 'admin' の場合のみアクセスを許可
const adminOnly = async (req, res, next) => {

  // Cookieからtokenを取得
  const admin_token = req.cookies?.admin_token;
  
  if (!admin_token) return res.status(401).json({ message: '認証トークンがありません' });

  try {
    const decoded = jwt.verify(admin_token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "管理者のみアクセス可能です" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: "認証エラー" });
  }
};

module.exports = { adminOnly };