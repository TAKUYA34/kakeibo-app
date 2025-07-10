const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

async function insertMany(transactions) {
  return await Transaction.insertMany(transactions);
}

async function getLatestTransactionByMonth(userId, startOfMonth, endOfMonth) {
  
  const objectUserId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;

  const lastTransaction = await Transaction.findOne({
    user_id: objectUserId,
    trans_date: { $gte: startOfMonth, $lte: endOfMonth }
  })
  .sort({ trans_date: -1, _id: -1}) // 一番最後の取引
  .limit(1) // 1件のみ
  .lean(); // 軽量化

  return lastTransaction; // total_amountではなく、取引全体を返す
}

module.exports = {
  insertMany,
  getLatestTransactionByMonth
};