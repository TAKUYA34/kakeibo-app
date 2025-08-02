// server/app.js
const express = require('express');
const cors = require('cors');
const auth = require('../middleware/auth_situation');
const adminAuth = require('../middleware/adminAuth_situation');

/* ルートのインポート */
// 一般ユーザー用
const loginFormRoutes = require('../routes/loginFormRoutes'); // ログイン画面
const signUpFormRoutes = require('../routes/signUpFormRoutes'); // 新規登録画面
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
const adminLoginFormRoutes = require('../routes/adminLoginFormRoutes'); // 管理者ログイン認証
const adminOnlyScreen = require('../routes/adminOnlyScreenRoutes'); // 管理者home画面の統計データ
const adminReportData = require('../routes/adminReportDataRoutes'); // 管理者お知らせ画面の各処理
const adminDashboardData = require('../routes/adminDashboardDataRoutes'); // 管理者ユーザー取引管理画面の各処理
const adminUsersManagementData = require('../routes/adminUsersManagementDataRoutes'); // 管理者ユーザー管理画面の各処理

require('dotenv').config({ path: './.env.development' }); // 環境変数の読み込み

const app = express();

// CORSの設定（順番に注意）
/* フロントエンドのポート3000からのリクエストを許可 */
app.use(cors({
  origin: process.env.FRONTEND_PORT || 'http://localhost:3000', // 'https://kake-ibo-app.com', // 本番環境ではフロントエンドのURLを指定
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
/* プリフライトリクエストへの対応（★重要）*/
app.options('*', cors());

/* JSON形式のリクエストボディをパース */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* 一般ユーザー用ルーティング */
app.use('/api/home', loginFormRoutes({ authenticate: auth.authenticate, isAdmin: auth.isAdmin })); // ログイン画面のルーティングを使用
app.use('/api/home', signUpFormRoutes); // 新規登録画面のルーティングを使用
app.use('/api/transactions', transactionAddRoutes(auth.authenticate)); // トランザクション追加のルーティングを使用
app.use('/api/transactions', transactionListRoutes(auth.authenticate)); // トランザクションリストのルーティングを使用
app.use('/api/summary', currentMoneyGraphRoutes); // homeグラフのルーティングを使用
app.use('/api/home', whatsNewRoutes(auth.authenticate)); // お知らせ表示のルーティングを使用
app.use('/api/transactions', exportPDFAndCSV(auth.authenticate)); // PDF or CSV出力データのルーティングを使用
app.use('/api/home', profileEditRoutes(auth.authenticate)); // プロフィール編集のルーティングを使用
app.use('/api/auth', requestPasswordReset); // passwordリセット申請のルーティングを使用
app.use('/api/auth', passwordReEnrollment); // password再登録のルーティングを使用
app.use('/api/info', infoPagesForm); // 問い合わせフォームのルーティングを使用

/* 管理者用ルーティング */
app.use('/api/admin', adminLoginFormRoutes(adminAuth.adminOnly)); // 管理者ログイン認証のルーティングを使用
app.use('/api/admin', adminOnlyScreen(adminAuth.adminOnly)); // 管理者home画面の統計データのルーティングを使用
app.use('/api/admin', adminReportData(adminAuth.adminOnly)); // 管理者お知らせ画面の各処理のルーティングを使用
app.use('/api/admin', adminDashboardData(adminAuth.adminOnly)); // 管理者ユーザー取引管理画面の各処理のルーティングを使用
app.use('/api/admin', adminUsersManagementData(adminAuth.adminOnly)); // 管理者ユーザー管理画面の各処理のルーティングを使用

module.exports = app;