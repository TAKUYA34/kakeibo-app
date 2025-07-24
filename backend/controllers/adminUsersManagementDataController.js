const adminUsersManagementDataService = require('../services/adminUsersManagementDataService');

/* ユーザーの全データを取得する */
const getAllNonAdminUsers = async (req, res) => {
  try {
    const Users = await adminUsersManagementDataService.fetchUsersExcludingAdmins();
    // console.log('users:', Users);
    res.status(200).json(Users);
  } catch (err) {
    // console.error('Error getting transactions:', err); 
    res.status(500).json({ message: 'ユーザーの取得に失敗しました' });
  }
};

/* ユーザー名検索 */
const getUsersByName = async (req, res) => {
  try {

    const name = req.body.name;

    const userName = await adminUsersManagementDataService.fetchUsersByName(name);
    // console.log('name:', userName);
    res.status(200).json(userName);
  } catch (err) {
    // console.error('Error getting transactions:', err); 
    res.status(500).json({ message: 'ユーザーの検索に失敗しました' });
  }
};

/* ユーザー編集 */
const updateUserComplete = async (req, res) => {
  try {
    // idと更新データを格納
    const userId = req.params.id; // routesのid名と合わせる
    const updatedData = req.body;
    // console.log('front側:', userId, updatedData);

    const updated = await adminUsersManagementDataService.updateUserById(userId, updatedData);
    // console.log('end側:', updated);
    res.status(200).json({
      message: 'ユーザー情報を更新しました',
      user: updated,
    });
  } catch (err) {
    // console.error('Error getting transactions:', err); 
    res.status(500).json({ message: 'ユーザーの更新に失敗しました' });
  }
};

/* ユーザー削除 */
const deleteUserComplete = async (req, res) => {
  try {
    const userId = req.params.id;

    await adminUsersManagementDataService.deleteUserById(userId);
    res.status(200).json({ message: 'ユーザーを削除しました' });
  } catch (err) {
    // console.error('Error getting transactions:', err); 
    res.status(500).json({ message: 'ユーザーの削除に失敗しました' });
  }
};

module.exports = {
  getAllNonAdminUsers,
  getUsersByName,
  updateUserComplete,
  deleteUserComplete
}
