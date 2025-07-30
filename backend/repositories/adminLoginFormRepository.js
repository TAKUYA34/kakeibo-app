const mongoose = require('mongoose'); // Mongoose
const User = require('../models/User'); // 既存のUserモデルを使う

/* ログイン成功時、管理者データを取得する */
const findAdminById = async (id) => {
  const objectId = new mongoose.Types.ObjectId(id);
  return await User.findOne({ _id: objectId, role: 'admin' });
};

/* 管理者のメールアドレスを取得する */
const findAdminByEmail = async (email) => {
  return await User.findOne({ email, role: 'admin' });
};

module.exports = {
  findAdminById,
  findAdminByEmail
};