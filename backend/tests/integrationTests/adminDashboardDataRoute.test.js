const request = require('supertest');
const mongoose = require('mongoose');
const appTest = require('../testServer/app.test');
const TransactionTest = require('../../models/Transaction');
const CategoryTest = require('../../models/Category');
const UserTest = require('../../models/User');

/* 一覧取得 */
describe('GET /api/admin/home/dashboard', () => {
  let userId;
  let transactionId;

  beforeAll(async () => {
    // 実行前にDBの保存先を指定する
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/integration_test');

    // テスト用ユーザーデータ
    const user = await UserTest.create({
      _id: new mongoose.Types.ObjectId(),
      user_name: 'Test User',
      email: 'test@example.com',
      password: 'hashed-password',
      is_admin: false,
    });

    userId = user._id;

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
  });

  // 検証後はDB削除する
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  /* 正常系 */
  it('全取引データを取得できる', async () => {
    // supertestを使用してリクエスト
    const res = await request(appTest)
      .get('/api/admin/home/dashboard')

    // 検証
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('user_id');
    expect(res.body[0]).toHaveProperty('amount');
  });

  /* 異常系 */
  it('ユーザーの取引データが0件の場合、エラーとなる', async () => {
    // transactionデータを削除
    await TransactionTest.deleteMany({});

    // supertestを使用してリクエスト
    const res = await request(appTest).get('/api/admin/home/dashboard');

    // 検証
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('取引データが見つかりませんでした');

    // 検証後はテスト用ユーザーを再生成する
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
  });

  /* 取引データ検索 */
  describe('POST /api/admin/home/dashboard/search', () => {
    /* 正常系 */
    it('ユーザー名やカテゴリで検索できる', async () => {
    // supertestを使用してリクエスト
      const res = await request(appTest)
        .post('/api/admin/home/dashboard/search')
        .send({
          name: 'Test User',
          category_middle: '食費',
        });

      // 検証
      expect(res.statusCode).toBe(200);
      expect(res.body[0]).toHaveProperty('memo', 'ランチ代');
    });

    /* 正常系 */
    it('検索欄が未入力の場合、エラーにならず空で返る', async () => {
      // supertestを使用してリクエスト
      const res = await request(appTest)
        .post('/api/admin/home/dashboard/search')
        .send({
          name: '',
          category_middle: '',
        }); // 未入力

      // 検証
      expect(res.statusCode).toBe(200);
    })
  });

  /* 編集 */
  describe('PUT /api/admin/home/dashboard/edit/:id', () => {
    /* 正常系 */
    it('取引を編集できる', async () => {
      // supertestを使用してリクエスト
      const res = await request(appTest)
        .put(`/api/admin/home/dashboard/edit/${transactionId}`)
        .send({
          amount: -6000,
          memo: '夕食代',
        });

      // 検証
      expect(res.statusCode).toBe(200);

      // レスポンスの構造確認
      expect(res.body).toHaveProperty('updatedData');
      expect(Array.isArray(res.body.updatedData)).toBe(true);

      // updatedData 配列の中から該当トランザクションを探す
      const updated = res.body.updatedData.find(t => t._id === transactionId.toString());

      // 検証
      expect(updated).toBeDefined();
      expect(updated).toHaveProperty('amount', -6000);
      expect(updated).toHaveProperty('memo', '夕食代');
    });

    /* 異常系 */
    it('存在しないIDで編集しようとするとエラーになる', async () => {
      // supertestを使用してリクエスト
      const res = await request(appTest)
        .put('/api/admin/home/dashboard/edit/6123456789abcdef01234567') // ダミーID
        .send({ amount: -2000 });

      // 検証
      expect(res.statusCode).toBe(500);
      expect(res.body.message).toMatch('取引の更新に失敗しました');
    });
  });

  /* 削除 */
  describe('DELETE /api/admin/home/dashboard/delete/:id', () => {
    /* 正常系 */
    it('取引を削除できる', async () => {
      // supertestを使用してリクエスト
      const res = await request(appTest)
        .delete(`/api/admin/home/dashboard/delete/${transactionId}`)

      // 検証
      expect(res.statusCode).toBe(200);
      expect(res.body.deletedUpdateTransactionTx.some(t => t._id === transactionId.toString())).toBe(false);
    });

    /* 異常系 */
    it('存在しないIDで削除しようとするとエラーになる', async () => {
      // supertestを使用してリクエスト
      const res = await request(appTest)
        .delete('/api/admin/home/dashboard/delete/6123456789abcdef01234567') // ダミーID

      // 検証
      expect(res.statusCode).toBe(500);
      expect(res.body.message).toMatch('取引の削除に失敗しました');
    });
  });
});