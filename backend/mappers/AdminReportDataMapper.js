/* データをmongoDBにコンバートする */
function mapToNoticeDao(notice) {
  return {
    _id: notice._id,
    title: notice.title,
    content: notice.content,
    notice_date: notice.notice_date,
  };
}

module.exports = { mapToNoticeDao };