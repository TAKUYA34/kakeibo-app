const adminReportDataRepository = require('../repositories/adminReportDataRepository');
const adminReportDataMapper = require('../mappers/adminReportDataMapper');

/* 全てのお知らせデータを取得する */
async function fetchPaginatedAllNotices(page, limit) {
  const skip = (page - 1) * limit; // 1 = 0件, 2 = 5件, 3 = 10件

  // 複数の関数処理を同時に実行する
  const [notices, total] = await Promise.all([
    adminReportDataRepository.getFetchPaginatedNotices(skip, limit), // ページ分取得する
    adminReportDataRepository.getCountNoticesAll() // 全件取得する
  ]);

  if (!notices) {
    throw new Error('お知らせのデータが見つかりません');
  }

  return {
    notices,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
}

/* 新規投稿したデータをDBに保存する */
async function registerNotice(data) {
  const created = await adminReportDataRepository.createNoticeData(data);

  if (!created) {
    throw new Error('formデータがありません');
  }

  return adminReportDataMapper.mapToNoticeDao(created);
}

/* 投稿した内容を編集する */
async function updateNotice(id, data) {
  const updated = await adminReportDataRepository.updateNoticeData(id, data);

  if (!updated) {
    throw new Error('更新元のデータがありません');
  }

  return adminReportDataMapper.mapToNoticeDao(updated);
}

/* 投稿したデータを削除する */
async function removeNotice(id) {
  return await adminReportDataRepository.deleteNoticeData(id);
}

module.exports = {
  fetchPaginatedAllNotices,
  registerNotice,
  updateNotice,
  removeNotice
};