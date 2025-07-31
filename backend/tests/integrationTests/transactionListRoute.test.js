const request = require('supertest');
const mongoose = require('mongoose');
const appTest = require('../testServer/app.test');
const TransactionTest = require('../../models/Transaction');

/* 家計簿データリスト画面 API */
describe('GET /api/transactions', () => {
  let userId;
  let categoryId;

  // 実行前にDBの保存先を指定する
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/integration_test');
  });

  // ダミーデータをセット
  beforeEach(async () => {
    await TransactionTest.deleteMany({}); // 一回削除
    userId = new mongoose.Types.ObjectId();
    categoryId = new mongoose.Types.ObjectId();

    const sampleData = [
      {
        transaction_id: new mongoose.Types.ObjectId().toString(),
        user_id: userId,
        category_id: categoryId,
        trans_type: 'expense',
        amount: 1000,
        total_amount: 1000,
        memo: 'ラーメン',
        major_sel: '食費',
        middle_sel: '外食',
        minor_sel: 'ランチ',
        trans_date: new Date('2025-03-01')
      },
      {
        transaction_id: new mongoose.Types.ObjectId().toString(),
        user_id: userId,
        category_id: categoryId,
        trans_type: 'expense',
        amount: 3000,
        total_amount: 4000,
        memo: '買い物',
        major_sel: '食費',
        middle_sel: '自炊',
        minor_sel: 'スーパー',
        trans_date: new Date('2025-03-15')
      },
      {
        transaction_id: new mongoose.Types.ObjectId().toString(),
        user_id: userId,
        category_id: categoryId,
        trans_type: 'expense',
        amount: 2000,
        total_amount: 6000,
        memo: '',
        major_sel: '交通',
        middle_sel: '電車',
        minor_sel: '通勤',
        trans_date: new Date('2025-04-10'),
      },
    ];

    await TransactionTest.insertMany(sampleData);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  /* 正常系 */
  it('GET /api/transactions/list 年と月の一覧を返す', async () => {
    // supertestを使用してリクエスト
    const res = await request(appTest).get('/api/transactions/list');

    // 検証
    expect(res.statusCode).toBe(200);
    // 年と月の一覧がDBに登録されていること
    expect(res.body.years).toEqual(expect.arrayContaining([2025]));
    expect(res.body.months).toEqual(expect.arrayContaining([3, 4]));
  });

  /* 正常系 */
  it('GET /api/transactions/list/aggregate 集計データを返す', async () => {
    // supertestを使用してリクエスト
    const res = await request(appTest).get(`/api/transactions/list/aggregate?year=2025&userId=${userId.toString()}`);

    // 検証
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    // 1件目に "monthly" プロパティがあることを確認
    expect(res.statusCode).toBe(200);
    expect(res.body[0]).toHaveProperty('monthly');
    expect(res.body[0].monthly[0]).toHaveProperty('month');
    expect(res.body[0].monthly[0]).toHaveProperty('amount');
  });

  /* 異常系 */
  it('GET /api/transactions/list/aggregate?year=2025&userId=invalidId userIdが空の場合、データが空で返ってくる', async () => {
    // 存在しないID
    const invalidUserId = new mongoose.Types.ObjectId().toString();

    // supertestを使用してリクエスト
    const res = await request(appTest).get(`/api/transactions/list/aggregate?year=2025&userId=${invalidUserId}`);

    // 検証
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    // 空配列が返ってくる
    expect(res.body.length).toBe(0);
  });

  /* 異常系 */
  it('GET /api/transactions/list/aggregate?year=invalid&userId=xxx  yearが数字以外の場合、ステータスコードが500でエラーを返す', async () => {
    // supertestを使用してリクエスト
    const res = await request(appTest).get(`/api/transactions/list/aggregate?year=notanumber&userId=${userId.toString()}`);

    // 検証
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error', '月別集計の取得に失敗しました');
  });
});