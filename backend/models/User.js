const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// usersテーブルのスキーマ定義
const userSchema = new mongoose.Schema({
  user_name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// パスワードを保存前にハッシュ化
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  try {
    const salt = bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, await salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);