const bcrypt = require('bcrypt'); // bcryptを使用してパスワードをハッシュ化
const jwt = require('jsonwebtoken'); // JWTを使用してトークンを生成
const adminLoginFormRepository = require('../repositories/adminLoginFormRepository');

const SECRET_KEY = process.env.JWT_SECRET; // 環境変数からシークレットキーを取得

/* 管理者のユーザープロフィールを取得する関数 */
const fetchAdminProfile = async (userPayload) => {
  if (userPayload?.role !== 'admin') return null;
  // console.log('userPayload', userPayload);
  /* DBから最新の管理者情報を取得する */
  const user = await adminLoginFormRepository.findAdminById(userPayload._id);
  // console.log('user', user);
  return user;
};

/* 管理者ログイン処理 */
const loginAdminUser = async (email, password) => {
  const admin = await adminLoginFormRepository.findAdminByEmail(email);

  // 管理者ロールではない
  if (!admin || admin.role !== 'admin') {
    const error = new Error('管理者情報が見つかりません');
    error.code = 'ADMIN_NOT_FOUND';
    throw error;
  }

  // パスワードが一致しない
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    const error = new Error('パスワードが違います');
    error.code = 'INVALID_PASSWORD';
    throw error;
  }
  
  // JWTトークンを生成
  const token = jwt.sign(
    {
      id: admin._id,
      role: admin.role,
      user_id: admin.user_id,
      email: admin.email,
    },
    SECRET_KEY,
    { expiresIn: '2h' }
  );

  return {
    token,
    user: {
      user_id: admin.user_id,
      user_name: admin.user_name,
      email: admin.email,
      role: admin.role
    }
  };
};

/* 管理者ログアウト処理 */
const logoutAdminUser = async (adminId) => {

  if (!adminId) {
    throw new Error('管理者IDが取得できません');
  }

  await adminLoginFormRepository.updateLoginAdminStatus(adminId, false);
};

module.exports = {
  fetchAdminProfile,
  loginAdminUser,
  logoutAdminUser
};