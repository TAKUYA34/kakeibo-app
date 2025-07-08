const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

async function getMonthlyTotalByUser(userId, startOfMonth, endOfMonth) {
  
  // 月ごとの合計を計算
  const result = await Transaction.aggregate([ // 月ごとの合計を計算
    {
      $match: {
        user_id: new mongoose.Types.ObjectId(userId), // ユーザーIDでフィルタリング
        trans_date: { $gte: startOfMonth, $lte: endOfMonth }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" }
      }
    }
  ]);
  return result.length > 0 ? result[0].total : 0; // 合計金額を返す
}

async function insertMany(transactions) {
  return await Transaction.insertMany(transactions);
}

module.exports = {
  getMonthlyTotalByUser,
  insertMany
};