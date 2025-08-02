const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

/* 月別集計 */
async function aggregateMonthlySummary(userId) {
  const objectUserId = new mongoose.Types.ObjectId(userId); // 文字列をObjectIdに変換
  return await Transaction.aggregate([
    { $match: { user_id: objectUserId } },
    {
      $group: {
        _id: {
          year: { $year: '$trans_date' },
          month: { $month: '$trans_date' } // 2025-07
        },
        income: {
          $sum: {
            $cond: [{ $gt: ['$amount', 0] }, '$amount', 0] // 収支
          }
        },
        expense: {
          $sum: {
            $cond: [{ $lt: ['$amount', 0] }, { $abs: '$amount' }, 0] // 支出
          }
        }
      }
    },
    {
      // 統合
      $project: {
        date: {
          $concat: [
            { $toString: '$_id.year' },
            '-',
            {
              $cond: [
                { $lt: ['$_id.month', 10] },
                { $concat: ['0', { $toString: '$_id.month' }] },
                { $toString: '$_id.month' }
              ]
            }
          ]
        },
        income: 1,
        expense: 1,
        _id: 0
      }
    },
    { $sort: { date: 1 } }
  ]);
}

/* カテゴリ別（中項目＋小項目）集計データ */
async function aggregateCategorySummary(userId) {
  const objectUserId = new mongoose.Types.ObjectId(userId); // 文字列をObjectIdに変換
  return await Transaction.aggregate([
    // $lt: 0 = 正の数だとマッチしない
    { $match: { user_id: objectUserId, amount: { $lt: 0 } } }, // 支出のみ
    {
      $group: {
        _id: {
          middle: '$middle_sel',
          minor: '$minor_sel' // 大項目、中項目
        },
        value: { $sum: { $abs: '$amount' } } // 金額
      }
    },
    {
      // 統合
      $project: {
        middle: '$_id.middle',
        minor: '$_id.minor',
        value: 1,
        _id: 0
      }
    },
    { $sort: { value: -1 } }
  ]);
}

module.exports = {
  aggregateMonthlySummary,
  aggregateCategorySummary
};