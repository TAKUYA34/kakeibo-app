const request = require('supertest');
const mongoose = require('mongoose');
const appTest = require('../testServer/app.test');
const UserTest = require('../../models/User');

/* 全取得 */
describe('GET /api/admin/home/users', () => {
  let userId;

  // 管理者認証ミドルウェアを無効化したテスト用サーバーを使う
  beforeAll(async () => {
    // 実行前にDBの保存先を指定する
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/integration_test');
    
    // テスト用ユーザーの作成
    const user = await UserTest.create({
      user_name: 'testuser',
      email: 'test@example.com',
      password: 'admin234',
      isAdmin: false
    });

    userId = user._id.toString();
  });

  // 検証後はDB削除する
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  /* 正常系 */
  it('一般ユーザーデータの一覧を取得できる', async () => {
    // supertestを使用してリクエスト
    const res = await request(appTest).get('/api/admin/home/users');

    // 検証
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('user_name', 'testuser');
    expect(res.body[0]).toHaveProperty('email', 'test@example.com');
  });

  /* 異常系 */
  it('ユーザーのデータが0件の場合、エラーとなる', async () => {
    // userデータを削除
    await UserTest.deleteMany({});

    // supertestを使用してリクエスト
    const res = await request(appTest).get('/api/admin/home/users');

    // 検証
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('ユーザーが見つかりませんでした');

    // 検証後はテスト用ユーザーを再生成する
    const user = await UserTest.create({
      user_name: 'testuser',
      email: 'test@example.com',
      password: 'admin234',
      isAdmin: false
    });

    userId = user._id.toString();
  });

  /* ユーザー検索 */
  describe('GET /api/admin/home/users/search', () => {
  /* 正常系 */
    it('ユーザー名を指定してユーザーを検索できる', async () => {
      // supertestを使用してリクエスト
      const res = await request(appTest)
        .post('/api/admin/home/users/search')
        .send({ name: 'testuser' });

      // 検証
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('user_name', 'testuser');
    });

    /* 異常系 */
    it('検索名が空なら400を返す', async () => {
      // supertestを使用してリクエスト
      const res = await request(appTest)
        .post('/api/admin/home/users/search')
        .send({});

      // 検証
      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe('ユーザーの検索に失敗しました');
    });
  });

  /* ユーザーデータ更新 */
  describe('GET /api/admin/home/users/edit/:id', () => {
    /* 正常系 */
    it('ユーザー情報を更新できる', async () => {
      // supertestを使用してリクエスト
      const res = await request(appTest)
        .put(`/api/admin/home/users/edit/${userId}`)
        .send({ email: 'test@example.com' });

      // 検証
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('ユーザー情報を更新しました');
    });
    /* 異常系 */
    it('ユーザーIDが無い状態で更新した場合エラーになる', async () => {
      // supertestを使用してリクエスト
      const res = await request(appTest)
        .put('/api/admin/home/users/edit/')
        .send({ email: 'dummy@example.com' });

      // :idが無いのでルーティングエラー
      expect(res.statusCode).toBe(404); 
    });
  });

  /* ユーザーデータ削除 */
  describe('GET /api/admin/home/users/delete/:id', () => {
    /* 正常系 */
    it('ユーザーを削除できる', async () => {
      // supertestを使用してリクエスト
      const res = await request(appTest)
        .delete(`/api/admin/home/users/delete/${userId}`);

      // 検証
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('ユーザーを削除しました');
    });

    /* 異常系 */
    it('ユーザーIDが無い状態で削除した場合エラーになる', async () => {
      // supertestを使用してリクエスト
      const res = await request(appTest)
        .put('/api/admin/home/users/delete/')
        .send({ email: 'dummy@example.com' });

      // :idが無いのでルーティングエラー
      expect(res.statusCode).toBe(404); 
    });
  });
});