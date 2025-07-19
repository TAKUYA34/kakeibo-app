const whatsNewRepository = require('../repositories/whatsNewRepository');

async function fetchNotices(page, limit) {
  return await whatsNewRepository.getNoticesByPage(page, limit);
}

module.exports = {
  fetchNotices
}
