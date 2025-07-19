const Notice = require('../models/Notice');

async function getNoticesByPage(page, limit) {
  const skip = (page - 1) * limit; // 1 = 3件

  const [notices, totalCount] = await Promise.all([
    Notice.find().sort({notice_date: -1 }).skip(skip).limit(limit),
    Notice.countDocuments()
  ])
  return {
    notices,
    totalCount
  };
}

module.exports = {
  getNoticesByPage
}