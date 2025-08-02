const request = require('supertest');
const mongoose = require('mongoose');
const appTest = require('../testServer/app.test'); // テスト用Expressアプリ
const TransactionTest = require('../../models/Transaction');

describe('GET /api/summary/monthly', () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const categoryId = new mongoose.Types.ObjectId();

  beforeAll(async () => {
    // 実行前にDBの保存先を指定する
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/integration_test');

    // テストデータの準備
    await TransactionTest.insertMany([
      {
        transaction_id: new mongoose.Types.ObjectId().toString(),
        user_id: userId,
        category_id: categoryId,
        trans_type: 'expense',
        trans_date: new Date('2024-07-10'),
        amount: -1000,
        total_amount: -1000,
        major_sel: '支出',
        middle_sel: '光熱費',
        minor_sel: 'ガス',
        memo: ''
      },
      {
        transaction_id: new mongoose.Types.ObjectId().toString(),
        user_id: userId,
        category_id: categoryId,
        trans_type: 'expense',
        trans_date: new Date('2024-07-20'),
        amount: -1000,
        total_amount: -2000,
        major_sel: '支出',
        middle_sel: '光熱費',
        minor_sel: '電気',
        memo: ''
      },
    ]);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase(); // テストDB初期化
    await mongoose.disconnect();
  });

  /* 正常系 */
  it('月別家計簿集計データを取得できる', async () => {
    // supertestを使用してリクエスト
    const res = await request(appTest)
      .get('/api/summary/monthly')
      .query({ userId });

    // 検証
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // データが正常に取得できているか
    expect(res.body[0]).toHaveProperty('date');
    expect(res.body[0]).toHaveProperty('expense');
    expect(res.body[0]).toHaveProperty('income');
  });

  /* 異常系 */
  it('userIdが無い場合は400エラーを返す', async () => {
    // supertestを使用してリクエスト
    const res = await request(appTest).get('/api/summary/monthly');

    // 検証
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('userIdが必要です');
  });

  describe('GET /api/summary/categories', () => {
    /* 正常系 */
    it('カテゴリ別家計簿集計データを取得できる', async () => {
    // supertestを使用してリクエスト
      const res = await request(appTest)
        .get(`/api/summary/categories`)
        .query({ userId });

      // 検証
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('value');
      expect(res.body[0]).toHaveProperty('middle');
      expect(res.body[0]).toHaveProperty('minor');
    });

    /* 異常系 */
    it('userIdが無い場合は400エラーを返す', async () => {
      // supertestを使用してリクエスト
      const res = await request(appTest).get('/api/summary/categories');

      // 検証
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('userIdが必要です');
    });
  });
});