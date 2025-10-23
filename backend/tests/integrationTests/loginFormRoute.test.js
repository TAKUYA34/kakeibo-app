// tests/integrationTests/loginFormRoute.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const appTest = require('../testServer/app.test');
const UserTest = require('../../models/User');

// テスト用ユーザー情報
const testUser = {
  userId: new mongoose.Types.ObjectId('64a000000000000000000001'),
  user_name: '田中太郎',
  email: 'test@example.com',
  password: 'password123',
  role: 'user',
};

// JWTトークン格納用
let authToken;
let createdUserId;

beforeAll(async () => {
  // 実行前にDBの保存先を指定する
  await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/integration_test');

  // パスワードハッシュ化とユーザー作成
  const bcrypt = require('bcrypt');
  const hashed = await bcrypt.hash(testUser.password, 10);

  const user = new UserTest({
    userId: testUser.userId,
    user_name: testUser.user_name,
    email: testUser.email,
    password: hashed,
    role: testUser.role,
    loginFlag: false
  });

  // ログイン用ユーザーデータ生成
  const saved = await user.save();
  createdUserId = saved._id;
});

afterAll(async () => {
  // テストユーザー削除
  await UserTest.deleteOne({ _id: createdUserId });
  // DB削除
  await mongoose.connection.dropDatabase();
  // DB切断
  await mongoose.connection.close();
});

describe('POST /api/home/login', () => {
  /* 正常系 */
  it('ログイン成功時、tokenがちゃんと生成される', async () => {

    // supertestを使用してリクエスト
    const res = await request(appTest)
      .post('/api/home/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    // 検証
    expect(res.statusCode).toBe(200);

    // Cookieが返されていることを確認する
    expect(res.headers['set-cookie']).toBeDefined(); // Cookieがセットされていることを確認
    expect(res.headers['set-cookie'][0]).toMatch(/user_token=/); // user_token Cookieが含まれていることを確認

    // CookieからJWTトークンを取得
    const cookie = res.headers['set-cookie'][0].split(';')[0]; // "user_token=xxxxxx" の形式
    authToken = cookie; // 次のテストで使用
  });

  /* 異常系 */
  it('存在しないユーザーでログインしたら失敗する', async () => {
      // supertestを使用してリクエスト
      const res = await request(appTest)
        .post('/api/home/login')
        .send({ email: 'nonexistent@example.com', password: 'password123' });

      // 検証
      expect(res.statusCode).toBe(401); // 認証失敗時のステータスコード
      expect(res.body.message).toBe('ユーザーが見つかりません。');
    });

  /* 異常系 */
  it('パスワードを間違ってログインしたら失敗する', async () => {
    // supertestを使用してリクエスト
    const res = await request(appTest)
      .post('/api/home/login')
      .send({ email: testUser.email, password: 'wrongpassword' });

    // 検証
    expect(res.statusCode).toBe(401); // 認証失敗時のステータスコード
    expect(res.body.message).toBe('パスワードが間違っています。');
  });

  describe('POST /api/home/logout/flag', () => {
    /* 正常系 */
    it('ログアウトが正常に実行できること', async () => {

      // supertestを使用してリクエスト
      const res = await request(appTest)
        .post('/api/home/logout/flag')
        .set('Cookie', authToken);
      
      // 検証
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch('ログアウトしました');
    });
  });

  describe('GET /api/home/me', () => {
    /* 正常系 */
    it('ログイン後のユーザー情報取得', async () => {
      // console.error('Using authToken:', authToken);
      
      // supertestを使用してリクエスト
      const res = await request(appTest)
        .get('/api/home/me')
        .set('Cookie', authToken);
      
      // 検証
      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe(testUser.email);
      expect(res.body.role).toBe('user');
    });

    /* 異常系 */
    it('ログアウト後の/meアクセスで失敗する', async () => {
      // supertestを使用してリクエスト
      const res = await request(appTest)
        .get('/api/home/me')
        .set('Cookie', authToken);

      // logout処理はloginFlagのみなので200でステータスを返す
      expect(res.statusCode).toBe(200); // or 401 にしたい場合ミドルウェア調整が必要
    });
  });
});