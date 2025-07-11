const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('../routes/auth');
const transactionAddRoutes = require('../routes/transactionAddRoutes'); // トランザクション追加のルーティング
const transactionListRoutes = require('../routes/transactionListRoutes'); // トランザクションリストのルーティング
const currentMoneyGraphRoutes = require('../routes/currentMoneyGraphRoutes') // homeグラフ

require('dotenv').config(); // 環境変数の読み込み

const app = express();
const PORT = process.env.PORT || 5001;
const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/my_database';

// MongoDB接続
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB に接続しました');
}).catch((err) => {
  console.error('MongoDB 接続エラー:', err);
});

// CORSの設定（順番に注意）
// フロントエンドのポート3000からのリクエストを許可
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
// プリフライトリクエストへの対応（★重要）
app.options('*', cors());

// JSON形式のリクエストボディをパース
app.use(bodyParser.json());

// ルーティング
app.use('/home', authRoutes); // 認証関連のルーティングを使用
app.use('/transactions', transactionAddRoutes); // トランザクション追加のルーティングを使用
app.use('/transactions', transactionListRoutes); // トランザクションリストのルーティングを使用
app.use('/summary', currentMoneyGraphRoutes); // homeグラフのルーティングを使用

// サーバー起動
app.listen(PORT, () => {
  console.log(`サーバーがポート ${PORT} で起動しました`);
});