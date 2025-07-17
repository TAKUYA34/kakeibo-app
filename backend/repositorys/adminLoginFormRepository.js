const mongoose = require('mongoose'); // Mongoose
const User = require('../models/User'); // 既存のUserモデルを使う

const findAdminById = async (id) => {
  const objectId = new mongoose.Types.ObjectId(id);
  return await User.findOne({ _id: objectId, role: 'admin' });
};

const findAdminByEmail = async (email) => {
  return await User.findOne({ email, role: 'admin' });
};

module.exports = {
  findAdminById,
  findAdminByEmail
};