const User = require('../models/User');

/* ユーザー検索 */
const findByEmail = (email) => User.findOne({ email });

/* ログイン状態のステータス更新 */
const updateLoginStatus = (userId, status) =>
  User.updateOne({ _id: userId }, { $set: { is_logged_in: status } });

/* ログインしたユーザーデータを取得する */
const findById = (id) => User.findById(id);

/* 管理者がパスワード以外の一般ユーザーのデータを取得する */
const findAllExcludingPassword = () => User.find().select('-password');

module.exports = {
  findByEmail,
  updateLoginStatus,
  findById,
  findAllExcludingPassword
}