const request = require('supertest');
const mongoose = require('mongoose');
const appTest = require('../testServer/app.test');
const UserTest = require('../../models/User');

// メール送信モック (第一引数は文字列固定)
jest.mock('../../utils/mailer', () => ({
  sendTestResetEmail: jest.fn().mockResolvedValue(true),
}));

describe('POST /api/auth/password/request', () => {
  // 実行前にDBの保存先を指定する
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/integration_test');
  });

  // 検証前にテーブルをリセットする
  beforeEach(async () => {
    await UserTest.deleteMany({});
  });

  // 検証後もテーブルをリセットする
  afterAll(async () => {
    await mongoose.connection.close();
  });

  /* 正常系 */
  it('登録済みメールに対してリセットリクエストが成功する', async () => {
    // 事前にユーザーを作成
    await UserTest.create({
      user_name: 'resetUser',
      email: 'reset@example.com',
      password: 'originalPass123'
    });

    // supertestを使用してリクエスト
    const res = await request(appTest)
      .post('/api/auth/password/request')
      .send({ email: 'reset@example.com' });

    expect(res.statusCode).toBe(200);

    // ユーザー探索
    const user = await UserTest.findOne({ email: 'reset@example.com' });
    expect(user.resetPasswordToken).toBeDefined();
    expect(user.resetPasswordExpires).toBeDefined();
  });

  /* 異常系 */
  it('ユーザー未登録のメールでリクエストするとエラーになる', async () => {
    const res = await request(appTest)
      .post('/api/auth/password/request')
      .send({ email: 'unknown@example.com' });

    expect(res.statusCode).toBe(500);
    expect(res.text).toContain('リセットメール送信に失敗しました');
  });
});