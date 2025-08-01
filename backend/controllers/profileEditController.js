const profileEditService = require('../services/profileEditService');

/* 更新 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { user_name, email, password } = req.body;

    // console.log('userId', userId);

    const result = await profileEditService.updateUserProfile(userId, user_name, email, password);

    // console.log('res', result);

    if (!result) {
      // console.log("更新失敗: userが見つからない or 更新不可");
      return res.status(404).json({ message: 'ユーザー情報の更新に失敗しました' });
    }

    res.json({ message: 'プロフィールを更新しました', user: result });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/* 削除 */
const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const deletedUser = await profileEditService.deleteUser(userId);
    // console.log('delete完了', deletedUser);

    res.status(200).json({ message: 'アカウントを削除しました' });
  } catch (error) {
    // console.error(error);
    if (error.message.includes('ユーザーが見つかりません')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ message: 'サーバーエラー' });
  }
};

module.exports = {
  updateProfile,
  deleteProfile
};