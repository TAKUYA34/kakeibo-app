const adminOnlyScreenService = require('../services/adminOnlyScreenService');

/* グラフ用データを取得する */
const UserAllSelectData = async (req, res) => {
  try {
    const data = await adminOnlyScreenService.fetchUserAllSelectData();
    res.json(data);
  } catch (err) {
    // console.error("データの取得に失敗:", err);
    res.status(500).json({ message: "サーバーエラーが発生しました" + err.message });
  }
};

/* Userの統計データを取得する */
const UserAllStatsData = async (req, res) => {
  try {
    const stats = await adminOnlyScreenService.getUserAllStatsData();
    res.json(stats);
  } catch (err) {
    // console.error("データの取得に失敗:", err);
    res.status(500).json({ message: "サーバーエラーが発生しました" + err.message });
  }
}

module.exports = {
  UserAllSelectData,
  UserAllStatsData
};