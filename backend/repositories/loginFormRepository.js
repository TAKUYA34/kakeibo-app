const User = require('../models/User');

/* ユーザー検索 */
const findByEmail = async (email) => {
  return await User.findOne({ email });
} 

/* ログイン状態のステータス更新 */
const updateLoginStatus = async (userId, status) => {
  return await User.findByIdAndUpdate(userId, { is_logged_in: status }, { new: true });
}

/* ログインしたユーザーデータを取得する */
const findById = async (id) => {
  return await User.findById(id);
}

/* 管理者がパスワード以外の一般ユーザーのデータを取得する */
const findAllExcludingPassword = async () => {
  return await User.find().select('-password');
}

module.exports = {
  findByEmail,
  updateLoginStatus,
  findById,
  findAllExcludingPassword
}