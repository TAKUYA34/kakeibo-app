const bcrypt = require('bcrypt');
const userEditRepository = require('../repositories/profileEditRepository');
const { mapToUserUpdateFields } = require('../mappers/userEditMapper'); // mapper を使用

const updateUserProfile = async (userId, user_name, email, password) => {

  // ユーザーデータを取得する
  const validateCheckData = await userEditRepository.existingUser(userId);
  console.log("service:",validateCheckData );
  // ユーザーidがない
  if (!validateCheckData) {
    throw new Error('ユーザーが見つかりません');
  }

  // 他のユーザーがこのメールアドレスを使っていないかチェック
  const validateCheckEmail = await userEditRepository.emailOwner(email);
  // console.log("service:",validateCheckEmail );
  if (validateCheckEmail && validateCheckEmail._id.toString() !== validateCheckData._id.toString()) {
    throw new Error('そのメールアドレスは既に使用されています');
  }

  // 更新フィールドをマッピング
  const updateFields = mapToUserUpdateFields({ user_name, email });

  // パスワードが提供されていればハッシュ化して追加し、パスワードが入力されている場合は、以前のパスワードと異なるかチェック
  if (password) {
    const isSame = await bcrypt.compare(password, validateCheckData.password); // 照合
    if (isSame) {
      throw new Error('以前と同じパスワードは使用できません');
    }
    const hashedPassword = await bcrypt.hash(password, 10); // 被っていなければハッシュ化する
    updateFields.password = hashedPassword; // マッピング
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