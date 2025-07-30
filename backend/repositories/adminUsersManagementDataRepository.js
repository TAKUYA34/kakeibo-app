const Users = require('../models/User');

/* ユーザー全てのデータを取得 */
const findUsersWithoutAdmins = async () => {
  return await Users.find({ role: { $ne: 'admin' } })  // admin以外
    .select('user_name email role is_logged_in')
    .sort({ created_at: -1 }); // 新しい順
};

/* ユーザー名を取得 */
const findUserByName = async (name) => {
  return await Users.find({
    role: 'user',
    user_name: { $regex: name, $options: 'i' }
  }).select('-password');
};

/* ユーザーのデータを編集する */
const getUpdateUserById = async (userId, updatedData) => {
  return await Users.findByIdAndUpdate(userId, updatedData, { new: true });
};

/* ユーザーのデータを削除する */
const getDeleteUserById = async (userId) => {
  return await Users.findByIdAndDelete(userId);
};

module.exports = {
  findUsersWithoutAdmins,
  findUserByName,
  getUpdateUserById,
  getDeleteUserById
}