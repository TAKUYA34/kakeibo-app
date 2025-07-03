// const mongoose = require('mongoose');

// // カテゴリーテーブルのスキーマ定義
// const categorySchema = new mongoose.Schema({
//   category_id: { type: String, required: true, unique: true },
//   user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },       // ユーザーとの紐付け
//   category_type: { type: String, enum: ['income', 'expense'], required: true }, // 収入/支出
//   category_name: { type: String, required: true },
// });

// module.exports = mongoose.model('Category', categorySchema);