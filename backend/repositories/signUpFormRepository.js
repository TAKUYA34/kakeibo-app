const User = require('../models/User');

/* 重複チェック用全ユーザー取得 */
const findAll = () => User.find({}, 'password');

/* 新規ユーザーの情報をDBに登録する */
const createUser = (userData) => new User(userData).save();

module.exports = {
  findAll,
  createUser
}