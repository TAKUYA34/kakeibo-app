const Notice = require('../models/Notice');

/* 全てのお知らせデータをページ枚数分取得する */
async function getFetchPaginatedNotices(skip, limit) {
  return await Notice.find()
  .sort({notice_date: -1}) // 日付の新しい順
  .skip(skip) // N件スキップ
  .limit(limit); // 5件のみ取得する
}

/* 全てのお知らせデータを取得する */
async function getCountNoticesAll() {
  return await Notice.countDocuments(); // お知らせの総件数を取得する
}

/* 新規投稿したデータをDBに保存する */
async function createNoticeData(data) {
  const notice = new Notice(data);
  return await notice.save();
}

/* 投稿した内容を編集する */
async function updateNoticeData(id, data) {
  return await Notice.findByIdAndUpdate(id, data, { new: true }); // 更新後のお知らせデータを返す
}

/* 投稿したデータを削除する */
async function deleteNoticeData(id) {
  return await Notice.findByIdAndDelete(id);
}

module.exports = {
  getFetchPaginatedNotices,
  getCountNoticesAll,
  createNoticeData,
  updateNoticeData,
  deleteNoticeData
};