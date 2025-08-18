const mongoose = require('mongoose');
const User = require('../models/User');

/* ログイン成功時、管理者データを取得する */
const findAdminById = async (id) => {
  const objectId = new mongoose.Types.ObjectId(id);
  return await User.findOne({ _id: objectId, role: 'admin' });
};

/* 管理者のメールアドレスを取得する */
const findAdminByEmail = async (email) => {
  return await User.findOne({ email, role: 'admin' });
};

/* 管理者のログイン状態を更新する */
const updateLoginAdminStatus = async (adminId, status) => {
  return await User.findByIdAndUpdate(adminId, { is_logged_in: status }, { new: true });
};

module.exports = {
  findAdminById,
  findAdminByEmail,
  updateLoginAdminStatus
};