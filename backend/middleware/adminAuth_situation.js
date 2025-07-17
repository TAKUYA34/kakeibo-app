// middleware/adminAuth_situation.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 管理者専用のミドルウェア user.role が 'admin' の場合のみアクセスを許可
const adminOnly = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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