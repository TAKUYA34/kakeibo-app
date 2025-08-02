// server/app.js
const express = require('express');
const mockAuthenticateToken = require('../middlewares/mockAuthenticateToken'); // テスト用
const mockIsAdmin = (req, res, next) => next() // テスト用

/* ルートのインポート */
// 一般ユーザー用
const loginFormRoutes = require('../../routes/loginFormRoutes'); // ログイン画面
const signUpFormRoutes = require('../../routes/signUpFormRoutes'); // 新規登録画面
const transactionAddRoutes = require('../../routes/transactionAddRoutes'); // トランザクション追加
const transactionListRoutes = require('../../routes/transactionListRoutes'); // トランザクションリスト
const currentMoneyGraphRoutes = require('../../routes/currentMoneyGraphRoutes'); // homeグラフ
const whatsNewRoutes = require('../../routes/whatsNewRoutes'); // お知らせ表示
const exportPDFAndCSV = require('../../routes/exportPDFAndCSVRoutes'); // PDFもしくはCSVを出力する
const profileEditRoutes = require('../../routes/profileEditRoutes'); // プロフィール編集
const requestPasswordReset = require('../../routes/requestPasswordResetRoutes'); // passwordリセット申請
const passwordReEnrollment = require('../../routes/passwordReEnrollmentRoutes'); // password再登録
const infoPagesForm = require('../../routes/infoPagesFormRoutes'); // 問い合わせフォーム

// 管理者用
const adminLoginFormRoutes = require('../../routes/adminLoginFormRoutes'); // 管理者ログイン認証
const adminOnlyScreen = require('../../routes/adminOnlyScreenRoutes'); // 管理者home画面の統計データ
const adminReportData = require('../../routes/adminReportDataRoutes'); // 管理者お知らせ画面の各処理
const adminDashboardData = require('../../routes/adminDashboardDataRoutes'); // 管理者ユーザー取引管理画面の各処理
const adminUsersManagementData = require('../../routes/adminUsersManagementDataRoutes'); // 管理者ユーザー管理画面の各処理

require('dotenv').config({ path: './.env.development' }); // 環境変数の読み込み

const app = express();

/* JSON形式のリクエストボディをパース */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* 一般ユーザー用ルーティング */
app.use('/api/home', loginFormRoutes({ authenticate: mockAuthenticateToken.authenticateToken, isAdmin: mockIsAdmin })); // ログイン画面のルーティングを使用
app.use('/api/home', signUpFormRoutes); // 新規登録画面のルーティングを使用
app.use('/api/transactions', transactionAddRoutes(mockAuthenticateToken.mockAuthenticateToken)); // トランザクション追加のルーティングを使用
app.use('/api/transactions', transactionListRoutes(mockAuthenticateToken.mockAuthenticateToken)); // トランザクションリストのルーティングを使用
app.use('/api/summary', currentMoneyGraphRoutes); // homeグラフのルーティングを使用
app.use('/api/home', whatsNewRoutes(mockAuthenticateToken.mockAuthenticateToken)); // お知らせ表示のルーティングを使用
app.use('/api/transactions', exportPDFAndCSV(mockAuthenticateToken.mockAuthenticateWithTokenHeader)); // PDF or CSV出力データのルーティングを使用
app.use('/api/home', profileEditRoutes(mockAuthenticateToken.mockAuthenticateWithTokenHeader)); // プロフィール編集のルーティングを使用
app.use('/api/auth', requestPasswordReset); // passwordリセット申請のルーティングを使用
app.use('/api/auth', passwordReEnrollment); // password再登録のルーティングを使用 
app.use('/api/info', infoPagesForm); // 問い合わせフォームのルーティングを使用

/* 管理者用ルーティング */
app.use('/api/admin', adminLoginFormRoutes(mockAuthenticateToken.mockAuthenticateAdmin)); // 管理者ログイン認証のルーティングを使用
app.use('/api/admin', adminOnlyScreen(mockAuthenticateToken.mockAuthenticateAdmin)); // 管理者home画面の統計データのルーティングを使用
app.use('/api/admin', adminReportData(mockAuthenticateToken.mockAuthenticateAdmin)); // 管理者お知らせ画面の各処理のルーティングを使用
app.use('/api/admin', adminDashboardData(mockAuthenticateToken.mockAuthenticateAdmin)); // 管理者ユーザー取引管理画面の各処理のルーティングを使用
app.use('/api/admin', adminUsersManagementData(mockAuthenticateToken.mockAuthenticateAdmin)); // 管理者ユーザー管理画面の各処理のルーティングを使用

module.exports = app;