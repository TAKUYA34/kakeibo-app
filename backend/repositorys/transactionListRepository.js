const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

// DBからtrans_dateのみ取得する
const getAllTransactionDates = async () => {
  return await Transaction.find({}, 'trans_date');
}

// 年度とユーザーIDなどでフィルター可能な大項目・中項目・小項目ごとの月別合計を返す
// MongoDBのAggregation Pipeline構文で処理
const aggregateMonthlyByCategory = async (year, userId) => {
  const matchFilter = {
    $expr: { $eq: [ {$year: "$trans_date" }, year ]} // DBの年と等しいかどうかチェック
  }

  if (userId) {
    matchFilter.user_id = new mongoose.Types.ObjectId(userId);
  }

  const pipeline = [
    { $match: matchFilter }, // 年が一致するか
    {
      $addFields: {
        month: {$month: "$trans_date" } // 2025-1-30 → month: 1
      }
    },
    // 月毎に集計
    {
      $group: {
        _id: {
          major_sel: "$major_sel",
          middle_sel: "$middle_sel",
          minor_sel: "$minor_sel",
          month: "$month"
        },
        totalAmount: {$sum: "$amount"}, // 金額を合計する
        memos: {$addToSet: "$memo"} // 重複なし
      }
    },
    // 項目単位で整形
    {
      $group: {
        _id: {
          major_sel: "$_id.major_sel",
          middle_sel: "$_id.middle_sel",
          minor_sel: "$_id.minor_sel"
        },
        monthly: {
          $push: {
            month: "$_id.month",
            amount: "$totalAmount"
          }
        },
        memos: {$push: "$memos" }
      }
    },
    // 最終的な出力結果
    {
      $project: {
        _id: 0, // 出力しない
        major_sel: "$_id.major_sel",
        middle_sel: "$_id.middle_sel",
        minor_sel: "$_id.minor_sel",
        monthly: 1,
        memos: 1
      }
    }
  ];

  return await Transaction.aggregate(pipeline).exec();
};

module.exports = {
  getAllTransactionDates,
  aggregateMonthlyByCategory
};