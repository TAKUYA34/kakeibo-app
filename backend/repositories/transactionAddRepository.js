const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

/* 取得データ保存 */
async function insertMany(transactions) {
  return await Transaction.insertMany(transactions);
}

/* 最後に登録された取引データを一件取得する */
async function getLatestTransactionByMonth(userId, startOfMonth, endOfMonth) {
  
  const objectUserId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;

  // 取得
  const lastTransaction = await Transaction.findOne({
    user_id: objectUserId,
    trans_date: { $gte: startOfMonth, $lte: endOfMonth }
  })
  .sort({ trans_date: -1, _id: -1}) // 一番最後の取引
  .limit(1) // 1件のみ
  .lean(); // 軽量化

  return lastTransaction;
}

/* カテゴリ検索、なければ作成する */
async function findOrCreateCategory(userId, type, major, middle, minor) {
  // nullチェック
  console.log('[findOrCreateCategory] 引数の内容:', { userId, type, major, middle, minor });

  // バリデーション
  if (!type || !major || !middle) {
    console.warn('無効なカテゴリ値のためスキップ', {
      type,
      major,
      middle,
      minor
    });
    return null;
  }

  // 既存カテゴリを探す
  const existing = await Category.findOne({
    user_id: userId,
    category_type: type,
    category_major: major,
    category_middle: middle,
    category_minor: minor
  });

  if (existing) {
    return existing;
  }

  // なければ作成
  const category = new Category({
    user_id: userId,
    category_type: type,
    category_major: major,
    category_middle: middle,
    category_minor: minor
  });

  try {
    const saved = await category.save();
    return saved;
  } catch (error) {
    console.error('登録無効:', error);
    throw error;
  }
}

module.exports = {
  insertMany,
  getLatestTransactionByMonth,
  findOrCreateCategory
};