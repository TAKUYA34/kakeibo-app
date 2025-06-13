const mongoose = require('mongoose');

// transactionsテーブルのスキーマ定義
const transactionSchema = new mongoose.Schema({
  transaction_id: { type: String, unique: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },       // ユーザーとの紐付け
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  trans_type: { type: String, enum: ['income', 'expense'], required: true }, // 収入/支出
  amount: { type: Number, required: true },
  cost_type: {type: String, enum: ['fixed', 'variable'], required: true }, // 固定/変動
  memo: { type: String },
  trans_date: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);