const adminReportDataService = require('../services/adminReportDataService');

/* 全てのお知らせデータを取得する */
const getPaginatedAllNotices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const notices = await adminReportDataService.fetchPaginatedAllNotices(page, limit);
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: 'お知らせの取得に失敗しました' });
  }
};

/* 新規投稿したデータをDBに保存する */
const createNotice = async (req, res) => {
  try {
    const userId = req.user?._id ?? req.user?.id ?? 'admin';
    const newNotice = await adminReportDataService.registerNotice({
      ...req.body,
      user_id: userId
    });
    
    // console.log('res.data:', newNotice);
    res.status(201).json(newNotice);
  } catch (err) {
    // console.error('お知らせの作成に失敗:', err);
    res.status(500).json({ message: 'お知らせの作成に失敗しました' });
  }
};

/* 投稿した内容を編集する */
const updateNotice = async (req, res) => {
  try {
    const updatedNotice = await adminReportDataService.updateNotice(req.params.id, req.body); // 動的にidを送る
    res.json(updatedNotice);
  } catch (err) {
    // console.error(err.message);
    res.status(500).json({ message: 'お知らせの更新に失敗しました' });
  }
};

/* 投稿したデータを削除する */
const deleteNotice = async (req, res) => {
  try {
    await adminReportDataService.removeNotice(req.params.id); // 動的にidを送る
    res.status(204).send();
  } catch (err) {
    // console.error(err.message);
    res.status(500).json({ message: 'お知らせの削除に失敗しました' });
  }
};

module.exports = {
  getPaginatedAllNotices,
  createNotice,
  updateNotice,
  deleteNotice
};