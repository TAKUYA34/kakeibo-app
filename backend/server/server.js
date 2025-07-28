const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 一般ユーザー用
const authRoutes = require('../routes/auth'); // 認証関連のルーティング
const transactionAddRoutes = require('../routes/transactionAddRoutes'); // トランザクション追加
const transactionListRoutes = require('../routes/transactionListRoutes'); // トランザクションリスト
const currentMoneyGraphRoutes = require('../routes/currentMoneyGraphRoutes'); // homeグラフ
const whatsNewRoutes = require('../routes/whatsNewRoutes'); // お知らせ表示
const exportPDFAndCSV = require('../routes/exportPDFAndCSVRoutes'); // PDFもしくはCSVを出力する
const profileEditRoutes = require('../routes/profileEditRoutes'); // プロフィール編集
const requestPasswordReset = require('../routes/requestPasswordResetRoutes'); // passwordリセット申請
const passwordReEnrollment = require('../routes/passwordReEnrollmentRoutes'); // password再登録
const infoPagesForm = require('../routes/infoPagesFormRoutes'); // 問い合わせフォーム

// 管理者用
const authLoginFormRoutes = require('../routes/authLoginFormRoutes'); // 管理者ログイン認証
const adminOnlyScreen = require('../routes/adminOnlyScreenRoutes'); // 管理者home画面の統計データ
const adminReportData = require('../routes/adminReportDataRoutes'); // 管理者お知らせ画面の各処理
const adminDashboardData = require('../routes/adminDashboardDataRoutes'); // 管理者ユーザー取引管理画面の各処理
const adminUsersManagementData = require('../routes/adminUsersManagementDataRoutes'); // 管理者ユーザー管理画面の各処理

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

// 一般ユーザー用ルーティング
app.use('/api/home', authRoutes); // 認証関連のルーティングを使用
app.use('/api/transactions', transactionAddRoutes); // トランザクション追加のルーティングを使用
app.use('/api/transactions', transactionListRoutes); // トランザクションリストのルーティングを使用
app.use('/api/summary', currentMoneyGraphRoutes); // homeグラフのルーティングを使用
app.use('/api/home', whatsNewRoutes); // お知らせ表示のルーティングを使用
app.use('/api/transactions', exportPDFAndCSV); // PDF or CSV出力データのルーティングを使用
app.use('/api/home', profileEditRoutes); // プロフィール編集のルーティングを使用
app.use('/api/auth', requestPasswordReset); // passwordリセット申請のルーティングを使用
app.use('/api/auth', passwordReEnrollment); // password再登録のルーティングを使用
app.use('/api/info', infoPagesForm); // 問い合わせフォームのルーティングを使用

// 管理者用ルーティング
app.use('/api/admin', authLoginFormRoutes); // 管理者ログイン認証のルーティングを使用
app.use('/api/admin', adminOnlyScreen); // 管理者home画面の統計データのルーティングを使用
app.use('/api/admin', adminReportData); // 管理者お知らせ画面の各処理のルーティングを使用
app.use('/api/admin', adminDashboardData); // 管理者ユーザー取引管理画面の各処理のルーティングを使用
app.use('/api/admin', adminUsersManagementData); // 管理者ユーザー管理画面の各処理のルーティングを使用


// サーバー起動
app.listen(PORT, () => {
  console.log(`サーバーがポート ${PORT} で起動しました`);
});