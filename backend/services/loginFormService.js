const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginFormRepository = require('../repositories/loginFormRepository');

// JWTシークレットキー
const JWT_SECRET = process.env.JWT_SECRET;

/* ログイン処理 */
async function login(email, password) {
  try {
    const user = await loginFormRepository.findByEmail(email);
    // ユーザー(email)が見つからない
    if (!user) {
      const error =  new Error('ユーザーが見つかりません。');
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    // 重複したパスワードを許容しない
    if (!isMatch){
      const error = new Error('パスワードが間違っています。');
      error.code = 'INVALID_PASSWORD';
      throw error;
    } 

    await loginFormRepository.updateLoginStatus(user._id, true);

    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    return { token };
  } catch (err) {
    throw err;
  }
}

/* ログアウト時はtoken破棄し、ユーザーのデータを返却する */
async function logout(userId) {

  if (!userId) {
    throw new Error('ログインユーザーのデータの取得に失敗しました');
  }

  await loginFormRepository.updateLoginStatus(userId, false);
}

/* ログイン完了後にユーザーのデータを取得する */
async function getMyInfo(userId) {

  if (!userId) {
    throw new Error('ログインユーザーのデータの取得に失敗しました');
  }

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