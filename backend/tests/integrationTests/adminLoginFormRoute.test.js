const request = require('supertest');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const appTest = require('../testServer/app.test');
const UserTest = require('../../models/User');

/* ログイン処理 */
describe('POST /api/admin/login', () => {
  let adminToken;

  beforeAll(async () => {
    // 実行前にDBの保存先を指定する
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/integration_test');

    // 事前にパスワードハッシュ化
    const hashedPassword = await bcrypt.hash('password', 10);

    // _idを固定にする
    const fixedObjectId = new mongoose.Types.ObjectId('68907962fb0d9185c9fbc425');

    // テスト用管理者ユーザー作成
    const admin = new UserTest({
      _id: fixedObjectId,
      user_id: '819a70b9-9f1e-4b84-8242-08f0ea555ce0',
      user_name: 'testadmin',
      email: 'testadmin@example.com',
      password: hashedPassword,
      role: 'admin'
    });
    // 保存
    await admin.save();
  });

  // 検証後、管理者ユーザー削除
  afterAll(async () => {
    // テスト終了後に管理者ユーザー削除
    await UserTest.deleteMany({ email: 'testadmin@example.com' });
    await mongoose.disconnect();
  });

  /* 正常系 */
  it('正常にログインし、トークンが取得できるか', async () => {
    // supertestを使用してリクエスト
    const res = await request(appTest)
      .post('/api/admin/login')
      .send({ email: 'testadmin@example.com', password: 'password' });

    // 検証
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({
      user_name: 'testadmin',
      email: 'testadmin@example.com',
      role: 'admin'
    });

    adminToken = res.body.token;
  });

  /* 異常系 */
  it('存在しないメールアドレスでログインすると失敗する', async () => {
    // supertestを使用してリクエスト
    const res = await request(appTest)
      .post('/api/admin/login')
      .send({ email: 'notfound@example.com', password: 'password' });

    // 検証
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch('認証失敗');
  });

  /* 異常系 */
  it('パスワードが間違っていた場合に失敗する', async () => {
    // supertestを使用してリクエスト
    const res = await request(appTest)
      .post('/api/admin/login')
      .send({ email: 'testadmin@example.com', password: 'wrongpass' });

    // 検証
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch('認証失敗');
  });

  describe('GET /api/admin/me', () => {
    /* 正常系 */
    it('トークンを使って管理者プロフィールデータを取得できる', async () => {
      // supertestを使用してリクエスト
      const res = await request(appTest)
        .get('/api/admin/me')
        .set('Authorization', `Bearer ${adminToken}`);
  
      // 検証
      expect(res.statusCode).toBe(200);
      expect(res.body.user).toHaveProperty('email', 'testadmin@example.com');
      expect(res.body.user).toHaveProperty('role', 'admin');
    });
  
    /* 異常系 */
    it('トークンがない場合は401を返す', async () => {
      // supertestを使用してリクエスト
      const res = await request(appTest)
        .get('/api/admin/me');
  
      // 検証
      expect(res.statusCode).toBe(401); // tokenの取得に失敗
    });
  
    /* 異常系 */
    it('不正なトークンで認証した場合は403を返す', async () => {
      // supertestを使用してリクエスト
      const res = await request(appTest)
        .get('/api/admin/me')
        .set('Authorization', 'Bearer invalid_token');
  
      // 検証
      expect(res.statusCode).toBe(403); // 権限が付与されてないためエラー
    });
  });
});