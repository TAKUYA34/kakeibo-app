const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

async function insertMany(transactions) {
  return await Transaction.insertMany(transactions);
}

// 最新の total_amount を取得する（その月の中で最も遅い trans_date のデータ）
async function getLastTotalAmountByMonth(userId, startOfMonth, endOfMonth) {

  const objectUserId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;

  const lastTransaction = await Transaction.findOne({
    user_id: objectUserId,
    trans_date: { $gte: startOfMonth, $lte: endOfMonth }
  })
  .sort({ trans_date: -1 }) // trans_date の降順でソート
  .limit(1); // 1件

  return lastTransaction ? lastTransaction.total_amount : 0;
}

module.exports = {
  insertMany,
  getLastTotalAmountByMonth
};