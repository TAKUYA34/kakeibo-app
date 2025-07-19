const mongoose = require('mongoose');

// お知らせテーブルのスキーマ定義
const NoticeSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ユーザーとの紐付け
  title: { type: String, required: true }, // タイトル
  content: { type: String, required: true }, // お知らせ詳細
  notice_date: { type: Date, required: true }, // 日付
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notice', NoticeSchema);