const mongoose = require('mongoose');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

/* ユーザーデータを取得する */
const existingUser = async (userId) => {
  return await User.findById(userId);
};

/* 他のユーザーがこのメールアドレスを使っていないかチェック */
const emailOwner = async (email) => {
  return await User.findOne({ email });
};

/* ユーザー情報をDBに更新する */
const updateUserById = async (userId, updateFields) => {
  // userIdがUUID形式であることを確認
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('uuid形式のuserIdが無効です');
  }

  // update_atは現在の日時に設定 
  return await User.findByIdAndUpdate(
    userId, // user_id
    { $set: updateFields },
    { new: true }
  );
};

/* ユーザー情報を削除する */
const deleteUserById = async (userId) => {
  // userIdがUUID形式であることを確認
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('uuid形式のuserIdが無効です');
  }

  // 関連する取引を削除
  await Transaction.deleteMany({ user_id: userId });

  // ユーザーを削除
  const deleteCompleted = await User.findByIdAndDelete(userId);
  // 削除が成功したか確認
  if (!deleteCompleted) {
    throw new Error('ユーザーが見つかりませんでした');
  }
  return deleteCompleted;
};

module.exports = {
  updateUserById,
  deleteUserById,
  emailOwner,
  existingUser
};