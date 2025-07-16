// mappers/userMapper.js

const mapToUserUpdateFields = ({ user_name, email, password }) => {
  // ユーザー情報の更新に必要なフィールドをマッピング
  const updateFields = {};

  // user_name, email, password が存在する場合のみ更新フィールドに追加
  if (user_name) updateFields.user_name = user_name;
  if (email) updateFields.email = email;
  if (password) updateFields.password = password; // パスワードはハッシュ化してから保存
  updateFields.update_at = new Date(); // 更新日時を現在時刻に設定

  return updateFields;
};

module.exports = {
  mapToUserUpdateFields,
};