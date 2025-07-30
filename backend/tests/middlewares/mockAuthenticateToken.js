// middlewares/mockAuthenticateToken.js
const mongoose = require('mongoose');

// ダミーユーザー生成関数
function createMockUser(role = 'user') {
  return {
    id: new mongoose.Types.ObjectId(),
    email: `${role}@example.com`,
    role,
  };
}

// 一般ユーザー用ミドルウェア
function mockAuthenticateToken(req, res, next) {
  req.user = createMockUser('user');
  next();
}

// 管理者ユーザー用ミドルウェア
function mockAuthenticateAdmin(req, res, next) {
  req.user = createMockUser('admin');
  next();
}

module.exports = {
  mockAuthenticateToken,
  mockAuthenticateAdmin,
};