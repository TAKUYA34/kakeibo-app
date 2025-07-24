const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// usersテーブルのスキーマ定義
const userSchema = new mongoose.Schema({
  user_id: { type: String, default: uuidv4, unique: true },
  user_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  role: { // 管理者情報も追加
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  is_logged_in: { type: Boolean, default: false }, // ログインフラグ
  resetPasswordToken: { type: String }, // パスワードリセット用 token
  resetPasswordExpires: { type: Date } // token有効期限
});

module.exports = mongoose.model('User', userSchema);