const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('../routes/auth');
const transactionAddRoutes = require('../routes/transactionAddRoutes'); // トランザクション追加
const transactionListRoutes = require('../routes/transactionListRoutes'); // トランザクションリスト
const currentMoneyGraphRoutes = require('../routes/currentMoneyGraphRoutes'); // homeグラフ
const ExportPDFAndCSV = require('../routes/ExportPDFAndCSVRoutes'); // PDFもしくはCSVを出力する
const profileEditRoutes = require('../routes/profileEditRoutes'); // プロフィール編集

require('dotenv').config({ path: './.env.development' }); // 環境変数の読み込み

const app = express();
const PORT = process.env.BACKEND_PORT || 5001;
const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/my_database';

// MongoDB接続
mongoose.connect(mongoUri).then(() => {
  console.log('MongoDB に接続しました');
}).catch((err) => {
  console.error('MongoDB 接続エラー:', err);
});

// CORSの設定（順番に注意）
// フロントエンドのポート3000からのリクエストを許可
app.use(cors({
  origin: process.env.FRONTEND_PORT || 'http://localhost:3000', // 'https://kake-ibo-app.com', // 本番環境ではフロントエンドのURLを指定
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
// プリフライトリクエストへの対応（★重要）
app.options('*', cors());

// JSON形式のリクエストボディをパース
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ルーティング
app.use('/api/home', authRoutes); // 認証関連のルーティングを使用
app.use('/api/transactions', transactionAddRoutes); // トランザクション追加のルーティングを使用
app.use('/api/transactions', transactionListRoutes); // トランザクションリストのルーティングを使用
app.use('/api/summary', currentMoneyGraphRoutes); // homeグラフのルーティングを使用
app.use('/api/transactions', ExportPDFAndCSV); // PDF or CSV出力データのルーティングを使用
app.use('/api/home', profileEditRoutes); // プロフィール編集のルーティングを使用

// サーバー起動
app.listen(PORT, () => {
  console.log(`サーバーがポート ${PORT} で起動しました`);
});