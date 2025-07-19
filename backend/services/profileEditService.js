const bcrypt = require('bcrypt');
const userEditRepository = require('../repositories/profileEditRepository');
const { mapToUserUpdateFields } = require('../mappers/userEditMapper'); // mapper を使用

const updateUserProfile = async (userId, user_name, email, password) => {
  // 更新フィールドをマッピング
  const updateFields = mapToUserUpdateFields({ user_name, email });

  // パスワードが提供されていればハッシュ化して追加
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updateFields.password = hashedPassword;
  }

  // DB 更新
  const updatedUser = await userEditRepository.updateUserById(userId, updateFields);
  return updatedUser;
};

const deleteUser = async (userId) => {
  // ユーザーを削除
  return await userEditRepository.deleteUserById(userId);
};

module.exports = {
  updateUserProfile,
  deleteUser
};