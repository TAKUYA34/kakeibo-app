const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../testServer/app.test');
const User = require('../../models/User');

describe('POST /register', () => {

  // 実行前にDBの保存先を指定する
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/integration_test');
  });

  // 各テスト前にDB初期化
  beforeEach(async () => {
    await User.deleteMany({});
  });

  // テスト後にMongoDB切断
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('新規登録が成功する', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        user_name: 'testuser',
        email: 'test@example.com',
        password: 'securePassword123'
      });

    expect(res.statusCode).toBe(200); // 登録成功レスポンス
    const users = await User.find({});
    expect(users.length).toBe(1);
    expect(users[0].user_name).toBe('testuser');
  });

  it('同じパスワードの再登録は拒否される', async () => {
    // 先に1人登録
    await request(app).post('/register').send({
      user_name: 'firstuser',
      email: 'first@example.com',
      password: 'samePassword123'
    });

    // 同じパスワードで再登録（別のユーザー）
    const res = await request(app).post('/register').send({
      user_name: 'seconduser',
      email: 'second@example.com',
      password: 'samePassword123'
    });

    expect(res.statusCode).toBe(500);
    expect(res.text).toContain('このパスワードは既に使われています。');
  });
});