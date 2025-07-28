const whatsNewRepository = require('../repositories/whatsNewRepository');

/* お知らせデータを取得し、ページ数と表示数を制御する */
async function fetchNotices(page, limit) {
  // 異常系チェック
  if (typeof page !== 'number' || page <= 0 || typeof limit !== 'number' || limit <= 0) {
    throw new Error('無効な入力です');
  }
  try {
    return await whatsNewRepository.getNoticesByPage(page, limit);
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  fetchNotices
}
