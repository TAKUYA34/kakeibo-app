const whatsNewService = require('../services/whatsNewService');

/* お知らせデータを取得し、ページ数と表示数を制御する */
async function getNotices(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    
    const {notices, totalCount} = await whatsNewService.fetchNotices(page, limit);
    res.status(200).json({notices, totalCount});
  } catch (err) {
    // console.error('Error fetching notices:', err);
    res.status(500).json({ message: 'サーバーエラー: お知らせの取得に失敗しました' });
  }
}

module.exports = {
  getNotices
}
