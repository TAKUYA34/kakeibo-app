const adminUsersManagementDataRepository = require('../repositories/adminUsersManagementDataRepository');

/* ユーザーの全データを取得する */
const fetchUsersExcludingAdmins = async () => {
  return await adminUsersManagementDataRepository.findUsersWithoutAdmins();
};

/* ユーザー名検索 */
const fetchUsersByName = async (name) => {
  return await adminUsersManagementDataRepository.findUserByName(name);
};

/* ユーザーのデータを編集する */
const updateUserById = async (userId, updatedData) => {
  return await adminUsersManagementDataRepository.getUpdateUserById(userId, updatedData);
};

/* ユーザーのデータを削除する */
const deleteUserById = async (userId) => {
  return await adminUsersManagementDataRepository.getDeleteUserById(userId);
};

module.exports = {
  fetchUsersExcludingAdmins,
  fetchUsersByName,
  updateUserById,
  deleteUserById
}