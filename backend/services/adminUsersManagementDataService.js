const adminUsersManagementDataRepository = require('../repositories/adminUsersManagementDataRepository');

/* ユーザーの全データを取得する */
const fetchUsersExcludingAdmins = async () => {
  return await adminUsersManagementDataRepository.findUsersWithoutAdmins();
};

/* ユーザー名検索 */
const fetchUsersByName = async (name) => {

  if (!name) {
    throw new Error('ユーザー名の取得に失敗しました');
  }

  return await adminUsersManagementDataRepository.findUserByName(name);
};

/* ユーザーのデータを編集する */
const updateUserById = async (userId, updatedData) => {

  if (!userId || !updatedData) {
    throw new Error('ユーザーの更新に失敗しました');
  }

  return await adminUsersManagementDataRepository.getUpdateUserById(userId, updatedData);
};

/* ユーザーのデータを削除する */
const deleteUserById = async (userId) => {

  if (!userId) {
    throw new Error('ユーザーの削除に失敗しました');
  }

  return await adminUsersManagementDataRepository.getDeleteUserById(userId);
};

module.exports = {
  fetchUsersExcludingAdmins,
  fetchUsersByName,
  updateUserById,
  deleteUserById
}