// middlewares/mockAuthenticateToken.js
const mongoose = require('mongoose');

// req.user.id（固定のID）を使いたいとき用
function mockAuthenticateWithTokenHeader(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
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
  mockAuthenticateWithTokenHeader
};