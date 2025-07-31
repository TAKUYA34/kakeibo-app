const request = require('supertest');
const mongoose = require('mongoose');
const appTest = require('../testServer/app.test');
const UserTest = require('../../models/User');

describe('POST /register', () => {

  // 実行前にDBの保存先を指定する
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/integration_test');
  });

  // 各テスト前にDB初期化
  beforeEach(async () => {
    await UserTest.deleteMany({});
  });

  // テスト後にMongoDB切断
  afterAll(async () => {
    await mongoose.connection.close();
  });

  /* 正常系 */
  it('新規登録が成功する', async () => {

    // supertestを使用してリクエスト
    const res = await request(appTest)
      .post('/api/home/register')
      .send({
        user_name: 'testuser',
        email: 'test@example.com',
        password: 'securePassword123'
      });

    // 検証
    expect(res.statusCode).toBe(201); // 登録成功

    // 確認で登録したデータを1件取得する
    const users = await UserTest.find({});
    expect(users.length).toBe(1);
    expect(users[0].user_name).toBe('testuser');
  });

  /* 異常系 */
  it('同じパスワードの再登録は拒否される', async () => {
    // 先に1人登録
    await request(appTest).post('/api/home/register').send({
      user_name: 'firstuser',
      email: 'first@example.com',
      password: 'samePassword123'
    });

    // 同じパスワードで再登録
    const res = await request(appTest).post('/api/home/register').send({
      user_name: 'seconduser',
      email: 'second@example.com',
      password: 'samePassword123'
    });

    // 検証
    expect(res.statusCode).toBe(409);
    expect(res.text).toContain('このパスワードは既に使われています。');
  });
});