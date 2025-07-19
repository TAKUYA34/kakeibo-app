const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

async function getExportTransactions(userId, year, month) {
  
  // monthがあれば月単位、なければ年全体
  const start = new Date(`${year}-${month || '01'}-01T00:00:00.000Z`);
  const end = month
    ? new Date(new Date(year, Number(month), 0, 23, 59, 59, 999)) // 月末 最終日＋時間
    : new Date(`${year}-12-31T23:59:59.999Z`); // 1月 ~ 12月末まで
  const ObjectId = new mongoose.Types.ObjectId(userId);

  const dateResult = await Transaction.aggregate([
    {
      // 年 または 年 + 月 の日付を対象にする
      $match: {
        user_id: ObjectId,
        trans_date: {
          $gte: start,
          $lte: end
        }
      }
    },
    {
      $project: {
        trans_date: 1,
        major_sel: 1,
        middle_sel: 1,
        minor_sel: 1,
        memo: 1,
        amount: 1,
        total_amount: 1
      }
    }
  ]);

  console.log(`取得件数: ${dateResult.length}`);
  if (dateResult.length > 0) {
    console.log('取得データ例:', dateResult[0]);
  }
  return dateResult;
}

// 年月のdateのみ取得
async function getTransactionDates(userId) {
  return await Transaction.find({ user_id: userId }, { trans_date: 1, _id: 0 });
}

module.exports = {
  getExportTransactions,
  getTransactionDates
}