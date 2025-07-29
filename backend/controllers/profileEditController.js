const profileEditService = require('../services/profileEditService');

/* 更新 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { user_name, email, password } = req.body;

    const result = await profileEditService.updateUserProfile(userId, user_name, email, password);

    if (!result) {
      console.log("更新失敗: userが見つからない or 更新不可");
      return res.status(404).json({ message: 'ユーザー情報の更新に失敗しました' });
    }

    res.json({ message: 'プロフィールを更新しました' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/* 削除 */
const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const deletedUser = await profileEditService.deleteUser(userId);

    if (!deletedUser) {
      console.log("削除失敗: userが見つからない or 削除不可");
      return res.status(404).json({ message: 'ユーザーが見つかりませんでした' });
    }
    res.status(200).json({ message: 'アカウントを削除しました' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'サーバーエラー' });
  }
};

module.exports = {
  updateProfile,
  deleteProfile
};