const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginFormRepository = require('../repositories/loginFormRepository');

// 環境変数の読み込み
require('dotenv').config({ path: './.env.development' });

// JWTシークレットキー
const JWT_SECRET = process.env.JWT_SECRET;

/* ログイン処理 */
async function login(email, password) {
  try {
    const user = await loginFormRepository.findByEmail(email);
    if (!user) throw new Error('ユーザーが見つかりません。');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('パスワードが間違っています。');

    await loginFormRepository.updateLoginStatus(user._id, true);

    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return token;
  } catch (err) {
    throw err;
  }
}

/* ログアウト時はtoken破棄し、ユーザーのデータを返却する */
async function logout(userId) {
  await loginFormRepository.updateLoginStatus(userId, false);
}

/* ログイン完了後にユーザーのデータを取得する */
async function getMyInfo(userId) {
  return await loginFormRepository.findById(userId);
}

/* 管理者ログイン完了後に一般ユーザーのデータを取得する */
async function getAllUsers() {
  return await loginFormRepository.findAllExcludingPassword();
}

module.exports = {
  login,
  logout,
  getMyInfo,
  getAllUsers
}