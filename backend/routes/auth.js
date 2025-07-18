const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { authenticate, isAdmin } = require('../middleware/auth_situation');

// 環境変数の読み込み
require('dotenv').config({ path: './.env.development' });

// JWTシークレットキー
const JWT_SECRET = process.env.JWT_SECRET;

// ログインルート
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // 入力チェック
  if (!email || !password) {
    return res.status(400).json({ message: 'メールアドレスとパスワードを入力してください。' });
  }

  try {
    // ユーザー検索
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'ユーザーが見つかりません。' });
    }

    // パスワード照合
    const isMatch = await bcrypt.compare(password, user.password);
    // ログ出力
    if (!isMatch) {
      return res.status(401).json({ message: 'パスワードが間違っています。' });
    }

    // JWTトークン生成
    const token = jwt.sign({ email: user.email, id: user._id, role: user.role },
      JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  }
});

// 管理者専用：全ユーザー一覧
router.get('/admin/users', authenticate, isAdmin, async (req, res) => {
  const users = (await User.find()).select('-password');
  res.json(users);
})

// 一般ユーザー用：自身の情報
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // パスワード除外
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'サーバーエラー' });
  }
});

router.post('/register', async (req, res) => {
  const { user_name, email, password } = req.body;
  try {
    console.log('🪪 req.user:', req.user); // ここでどのユーザーと認識されているか確認
    // ユーザー名とメールアドレスの重複チェック
    const allUsers = await User.find({}, 'password');

    for (const user of allUsers) {
      const isSame = await bcrypt.compare(password, user.password);

      if (isSame) {
        return res.status(409).json({ message: 'このパスワードは既に使われています。他のパスワードを設定してください。'});
      }
    }
    // 必須フィールドのチェック
    if (!user_name || !email || !password) {
      return res.status(400).json({ message: '全てのフィールドを入力してください。' });
    }
    // passwordのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);
    // 新しいユーザーの作成
    const newUser = new User({
      user_name,
      email,
      password: hashedPassword
    });
    // 登録する
    await newUser.save();

    res.status(201).json({ success: true, message: 'ユーザー登録成功' });
  } catch (err) {
    console.error('登録エラー:', err);
    res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  }
});

module.exports = router;