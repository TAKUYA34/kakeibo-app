const request = require('supertest');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const appTest = require('../testServer/app.test');
const UserTest = require('../../models/User');
const TransactionTest = require('../../models/Transaction');
const CategoryTest = require('../../models/Category');

/* グラフ用データ */
describe('GET /api/admin/home/stats', () => {
  let adminToken;

  beforeAll(async () => {
    // ユーザーIDを明示的に生成しておく
    userId = new mongoose.Types.ObjectId();

    // passwordをハッシュ化
    const hashedPassword = await bcrypt.hash('password', 10);

    // 実行前にDBの保存先を指定する
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/integration_test');

    // カテゴリーデータ 
    const category = await CategoryTest.create({
      user_id: userId,
      category_type: 'expense',
      category_major: '支出',
      category_middle: '食費',
      category_minor: '外食'
    });

    categoryId = category._id;
    
    // テスト用取引データ
    const transaction = await TransactionTest.create({
      transaction_id: new mongoose.Types.ObjectId().toString(),
      user_id: userId,
      category_id: categoryId,
      trans_type: 'expense',
      trans_date: new Date('2025-07-15'),
      amount: -5000,
      total_amount: -5000,
      major_sel: '支出',
      middle_sel: '食費',
      minor_sel: '外食',
      memo: 'ランチ代',
    });

    transactionId = transaction._id;    

    // 管理者ユーザー作成＆ログイン（または固定トークンを利用）
    const admin = new UserTest({
      _id: new mongoose.Types.ObjectId(),
      user_name: 'admin',
      email: 'testadmin@example.com',
      password: hashedPassword,
      role: 'admin'
    });
    // 保存
    await admin.save();

    // ログイン処理
    const res = await request(appTest)
      .post('/api/admin/login')
      .send({ email: 'testadmin@example.com', password: 'password' });

    // token発行
    adminToken = res.body.token;
  });

  // 検証後はDB削除する
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  /* 正常系 */
  it('管理者統計データを取得できる（正常系）', async () => {
    // supertestを使用してリクエスト
    const res = await request(appTest)
      .get('/api/admin/home/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    // 検証
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('monthlyExpense');
    expect(res.body).toHaveProperty('monthlyTransactions');
    expect(res.body).toHaveProperty('totalUsers');
  });

  it('認証トークンがないと401になる', async () => {
    // supertestを使用してリクエスト
    const res = await request(appTest)
      .get('/api/admin/home/stats');

    // 検証
    expect(res.statusCode).toBe(401); // token取得エラー
  });

  /* Userの統計データを取得する */
  describe('GET /api/admin/home/data', () => {
    /* 正常系 */
    it('グラフデータを取得できる', async () => {
      // supertestを使用してリクエスト
      const res = await request(appTest)
        .get('/api/admin/home/data')
        .set('Authorization', `Bearer ${adminToken}`);

      // 検証
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('monthlyData');
      expect(res.body).toHaveProperty('categoryData');
      expect(Array.isArray(res.body.monthlyData)).toBe(true);
      expect(Array.isArray(res.body.categoryData)).toBe(true);
    });

    /* 異常系 */
    it('認証トークンがないと401になる', async () => {
      // supertestを使用してリクエスト
      const res = await request(appTest)
        .get('/api/admin/home/data');

      // 検証
      expect(res.statusCode).toBe(401); // token取得エラー
    });
  });
});