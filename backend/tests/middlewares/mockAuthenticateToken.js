// middlewares/mockAuthenticateToken.js
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// JWT認証（ログイン／ログアウト用）
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1] || req.cookies['user_token'] || req.cookies['admin_token']; // Cookieからも取得

  if (!token) return res.sendStatus(401);
  
  // jwt.verifyを使って認証する
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    
    // ロールチェック（user または admin のみ許可）
    if (!user.role || !['user', 'admin'].includes(user.role)) {
      return res.sendStatus(403); // 権限なし
    }

    // 対策：テスト用 payload に _id を追加
    if (!user._id && user.id) {
      user._id = user.id;
    }
    
    req.user = user;
    next();
  });
}

// req.user.id（固定のID）を使いたいとき用
function mockAuthenticateWithTokenHeader(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];

    try {
      const id = new mongoose.Types.ObjectId(token); // 有効なObjectId形式か確認
      req.user = {
        id,
        email: 'test@example.com',
        role: 'user',
      };
    } catch (err) {
      // 無効なObjectId形式だった場合は無視してreq.user未定義にする
      req.user = null;
    }
  }
  next();
}

// ダミーユーザーランダム生成関数
function createMockUser(role) {
  return {
    id: new mongoose.Types.ObjectId(),
    email: `${role}@example.com`,
    role,
  };
}

// ダミーユーザー用ミドルウェア
function mockAuthenticateToken(req, res, next) {
  req.user = createMockUser('user'); // ダミーユーザー生成用
  next();
}

// 管理者ダミーユーザー用ミドルウェア
function mockAuthenticateAdmin(req, res, next) {
  req.user = createMockUser('admin');
  next();
}

module.exports = {
  mockAuthenticateToken,
  mockAuthenticateAdmin,
  mockAuthenticateWithTokenHeader,
  authenticateToken
};