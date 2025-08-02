const request = require('supertest');
const appTest = require('../testServer/app.test');
const TransactionTest = require('../../models/Transaction');
const UserTest = require('../../models/User');
const { default: mongoose } = require('mongoose');

describe('GET /api/transactions/export', () => {
  // ObjectID生成
  const userId = new mongoose.Types.ObjectId("688aa76704c50cbbd9a78652");
  const categoryId = new mongoose.Types.ObjectId();
  
  beforeAll(async () => {
    // 実行前にDBの保存先を指定する
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/integration_test');
    
    // ユーザー作成（トークン代わりの存在）
    await UserTest.create({
      _id: userId,
      user_name: 'test_user',
      email: 'test@example.com',
      password: 'hashedpassword',
    });

    // テスト用のトランザクションデータ挿入
    await TransactionTest.insertMany([
      {
        transaction_id: new mongoose.Types.ObjectId().toString(),
        user_id: userId,
        category_id: categoryId,
        trans_type: 'expense',
        trans_date: new Date('2024-07-10'),
        amount: 1000,
        total_amount: 1000,
        major_sel: '支出',
        middle_sel: '光熱費',
        minor_sel: 'ガス',
        memo: 'Test CSV'
      },
      {
        transaction_id: new mongoose.Types.ObjectId().toString(),
        user_id: userId,
        category_id: categoryId,
        trans_type: 'expense',
        trans_date: new Date('2024-07-20'),
        amount: 1000,
        total_amount: 1000,
        major_sel: '支出',
        middle_sel: '光熱費',
        minor_sel: '電気',
        memo: 'Test PDF'
      },
    ]);
  });

  afterAll(async () => {
    // テストデータのクリーンアップ
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  /* 正常系 */
  it('取引データがCSV形式で出力される', async () => {
    // supertestを使用してリクエスト
    const res = await request(appTest)
      .get('/api/transactions/export')
      .query({ year: 2024, month: 7, format: 'csv' })
      .set('Authorization', `Bearer ${userId}`);

    // 検証
    expect(res.statusCode).toBe(200);
    expect(res.header['content-type']).toContain('text/csv');
    expect(res.text).toContain('trans_date'); // ヘッダー確認
  });

  /* 正常系 */
  it('取引データがPDF形式で出力される', async () => {
    // supertestを使用してリクエスト
    const res = await request(appTest)
      .get('/api/transactions/export')
      .query({ year: 2024, month: 7, format: 'pdf' })
      .set('Authorization', `Bearer ${userId}`);

    // 検証
    expect(res.statusCode).toBe(200);
    expect(res.header['content-type']).toContain('application/pdf');
    expect(res.body.length).toBeGreaterThan(100); // バッファが返る
  });

  /* 異常系 */
  it('年が未指定の状態で出力した場合、エラー', async () => {
    // supertestを使用してリクエスト
    const res = await request(appTest)
      .get('/api/transactions/export')
      .query({ month: 7, format: 'csv' }) // yearなし
      .set('Authorization', `Bearer ${userId}`);

    // 検証
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('年と形式は必須です、選択してください');
  });

  /* 異常系 */
  it('未対応のフォーマットで出力した場合、エラー', async () => {
    // supertestを使用してリクエスト
    const res = await request(appTest)
      .get('/api/transactions/export')
      .query({ year: 2024, month: 7, format: 'xlsx' }) // 未対応フォーマット
      .set('Authorization', `Bearer ${userId}`);

    // 検証
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('エクスポートに失敗しました');
  });

  describe('GET /api/transactions/date-options', () => {

    /* 正常系 */
    it('年と月が正常に取得できる', async () => {
      // supertestを使用してリクエスト
      const res = await request(appTest)
        .get('/api/transactions/date-options')
        .set('Authorization', `Bearer ${userId}`);

      // 検証
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('year');
      expect(res.body[0]).toHaveProperty('month');
    });
  });
});