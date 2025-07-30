const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

/* 家計簿データをパイプラインで整形して取得する */
async function getExportTransactions(userId, year, month) {
  
  const ObjectId = new mongoose.Types.ObjectId(userId);

  // monthがあれば月単位、なければ年全体
  let start, end;

  if (month) {
    // 月指定あり → 月初〜月末の23:59:59.999
    const m = Number(month) - 1; // JS Dateは0-indexed月
    start = new Date(year, m, 1, 0, 0, 0, 0); // 例: 2025-02-01 00:00
    end = new Date(year, m + 1, 0, 23, 59, 59, 999); // 例: 2025-02-28 23:59:59
  } else {
    // 月指定なし → 年初〜年末
    start = new Date(year, 0, 1, 0, 0, 0, 0); // 2025-01-01
    end = new Date(year, 11, 31, 23, 59, 59, 999); // 2025-12-31
  }

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

  // console.log(`取得件数: ${dateResult.length}`);
  // if (dateResult.length > 0) {
  //   console.log('取得データ例:', dateResult[0]);
  // }
  return dateResult;
}

/* 年月のdateのみ取得 */
async function getTransactionDates(userId) {
  return await Transaction.find({ user_id: userId }, { trans_date: 1, _id: 0 });
}

module.exports = {
  getExportTransactions,
  getTransactionDates
}