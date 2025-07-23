// const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Category = require('../models/Category');

/* ユーザー全取引データを取得する */
const findAllTransactions = async () => {
  return await Transaction.find({})
    .populate('user_id', 'user_name') // nameのみ
    .populate('category_id', 'category_major category_middle category_minor')
    .sort({ trans_date: -1 }) // 最新順に並べる
    .limit(100); // 100Pまでに制限
};

/* ユーザー名やカテゴリ、メモでキーワード検索する */
const keywordSearchTransactions = async (filters) => {
  // 絞り込み
  const { name, category_major, category_middle, category_minor, trans_date, memo } = filters;

  // 検索結果
  let query = {};

  // カテゴリ検索
  const andConditions = []; // AND検索
  const orConditions = []; // OR検索

  // ユーザー名検索
  let userIds = [];
  if (name) {
    const users = await User.find({
      user_name: { $regex: new RegExp(name, 'i') }
    }).select('_id');

    userIds = users.map(user => user._id);

    // ユーザーが存在しない場合
    if (userIds.length === 0) {
      return [];
    }

    andConditions.push({ user_id: { $in: userIds }});
  }

  // カテゴリ名検索
  let categoryIds = [];
  // 大項目 OR 中項目 OR 小項目のいずれかのデータがあるか
  if (category_major || (Array.isArray(category_middle) && category_middle.length > 0) || (Array.isArray(category_minor) && category_minor.length > 0)) {
    // category用 問い合わせ
    const categoryQuery = {};

    // 単一
    if (category_major) {
      categoryQuery.category_major = { $regex: new RegExp(category_major, 'i') };
    }
    // 単一 AND 複合
    if (Array.isArray(category_middle) && category_middle.length > 0) {
      categoryQuery.category_middle = { $in: category_middle.map(k => new RegExp(k, 'i')) };
    }
    // 単一 AND 複合
    if (Array.isArray(category_minor) && category_minor.length > 0) {
      categoryQuery.category_minor = { $in: category_minor.map(k => new RegExp(k, 'i')) };
    }

    const categories = await Category.find(categoryQuery).select('_id');
    categoryIds = categories.map(categories => categories._id);
    if (categoryIds.length === 0) return [];
    andConditions.push({ category_id: { $in: categoryIds } });
  }

  // メモ名検索
  if (Array.isArray(memo) && memo.length > 0) {
    orConditions.push({
      memo: {
        $in: memo.map(k => new RegExp(k, 'i'))
      }
    });
  }

  // 月検索（形式：07 → trans_dateの月が7）
  if (trans_date) {
    const month = parseInt(trans_date, 10);
    if (!isNaN(month)) {
      andConditions.push({
        $expr: {
          $eq: [{ $month: '$trans_date' }, month]
        }
      });
    }
  }

  // 最終クエリ
  query = {
    $and: [
      ...andConditions,
      ...(orConditions.length > 0 ? [{ $or: orConditions }] : [])
    ]
  };

  // 検索実行
  const results = await Transaction.find(query)
    .populate('user_id', 'user_name')
    .populate('category_id', 'category_major category_middle category_minor')
    .sort({ trans_date: -1 })
    .limit(100);

  return results;
};

/* IDで取引データを更新 */
async function updateTransactionById(id, updatedData) {
  return await Transaction.findByIdAndUpdate(id, updatedData, { new: true });
}

/* 月内の取引データを取得（検索したユーザー、該当月）*/
async function findMonthlyTransactions(userId, monthStart, monthEnd) {
  return await Transaction.find({
    user_id: userId,
    trans_date: { $gte: monthStart, $lte: monthEnd }
  }).sort({ trans_date: 1, createdAt: 1 });
}

/* 更新後ユーザーIDからすべての取引を取得する */
async function findAllTransactionsByUserId(userId) {
  return await Transaction.find({ user_id: userId })
    .populate('user_id')
    .populate('category_id');
}

/* 該当するデータを削除する */
const deleteTransactionById = async (id) => {
  return await Transaction.findByIdAndDelete(id);
};

/* 例：2025-07-01 ~ 2025-07-31までのデータを取得する */
async function deleteAfterGetMonthTransactions(userId, baseDate) {
  const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const end = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0, 23, 59, 59, 999);

  return await Transaction.find({
    user_id: userId,
    trans_date: { $gte: start, $lte: end }
  }).sort({ trans_date: 1, createdAt: 1 });
}

/* IDで取引データを取得 */
async function findTransactionById(id) {
  return await Transaction.findById(id);
}

/* bulkWrite で total_amount を一括更新 */
async function bulkUpdateAndDeleteTotalAmounts(bulkOps) {
  if (bulkOps.length > 0) {
    await Transaction.bulkWrite(bulkOps);
  }
}

module.exports = {
  // 全データ取得関数
  findAllTransactions,
  // 検索関数
  keywordSearchTransactions,
  // 編集用関数
  updateTransactionById,
  findAllTransactionsByUserId,
  findMonthlyTransactions,
  // 削除関数
  deleteTransactionById,
  deleteAfterGetMonthTransactions,
  // 編集と削除兼用
  findTransactionById,
  bulkUpdateAndDeleteTotalAmounts,
}