const bcrypt = require('bcrypt');
const signUpFormRepository = require('../repositories/signUpFormRepository');

/* 新規ユーザーの登録をする */
async function register({ user_name, email, password }) {
  // 重複チェック用全ユーザー取得
  const existingUsers = await signUpFormRepository.findAll();

  // パスワード重複チェック
  for (const user of existingUsers) {
    const isSame = await bcrypt.compare(password, user.password);
    if (isSame) throw new Error('このパスワードは既に使われています。');
  }

  // ハッシュ化
  const hashedPassword = await bcrypt.hash(password, 10);

  // ユーザー作成
  const newUser = {
    user_name,
    email,
    password: hashedPassword
  };

  // DBに保存する
  await signUpFormRepository.createUser(newUser);
}

module.exports = {
  register
}
