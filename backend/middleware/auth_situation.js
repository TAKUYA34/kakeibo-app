// middleware/auth_situation.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.REACT_JWT_SECRET;

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization']; 
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // トークンの検証
    req.user = decoded; // { email, id, role }
    next();
  } catch (err) {
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