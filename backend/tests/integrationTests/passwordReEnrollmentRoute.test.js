// tests/integrationTests/passwordReEnrollment.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const appTest = require('../testServer/app.test');
const UserTest = require('../../models/User');
const bcrypt = require('bcrypt');

describe('POST /api/auth/password/reset-password', () => {
  let user;
  let validToken;

  // 実行前にDBの保存先を指定する
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/integration_test');
  });

  // 実行前にUserテーブルをリセットする
  beforeEach(async () => {
    await UserTest.deleteMany({});

    validToken = 'valid-reset-token-123';

    // パスワードリセット用のトークンと期限を持つユーザーを作成
    user = await UserTest.create({
      user_name: 'TestUser',
      email: 'test@example.com',
      password: await bcrypt.hash('oldpassword', 10),
      resetPasswordToken: validToken,
      resetPasswordExpires: Date.now() + 3600000, // 1時間後まで有効
    });
  });

  // 検証後はDBを削除する
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  /* 正常系 */
  it('正常にパスワードがリセットされる', async () => {
    const newPassword = 'newsecurepassword';

    // supertestを使用してリクエスト
    const res = await request(appTest)
      .post('/api/auth/password/reset-password')
      .send({
        token: validToken,
        newPassword,
      });

    // 検証
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('パスワードがリセットされました。');

    // DBからユーザーを再取得してパスワードが変更されているか確認
    const updatedUser = await UserTest.findById(user._id);
    const isMatch = await bcrypt.compare(newPassword, updatedUser.password);
    expect(isMatch).toBe(true);
    expect(updatedUser.resetPasswordToken).toBeNull();
    expect(updatedUser.resetPasswordExpires).toBeNull();
  });

  /* 異常系 */
  it('無効なトークンでエラーを返す', async () => {

    // supertestを使用してリクエスト
    const res = await request(appTest)
      .post('/api/auth/password/reset-password')
      .send({
        token: 'invalid-token',
        newPassword: 'somepassword',
      });

    // 検証
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('無効なトークンです。');
  });

  /* 異常系 */
  it('期限切れのトークンでエラーを返す', async () => {
    // トークン期限切れのユーザーを用意
    await UserTest.updateOne(
      { _id: user._id },
      { resetPasswordExpires: Date.now() - 1000 } // 強制的にtoken切る
    );

    // supertestを使用してリクエスト
    const res = await request(appTest)
      .post('/api/auth/password/reset-password')
      .send({
        token: validToken,
        newPassword: 'newpass',
      });

    // 検証
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('無効なトークンです。');
  });

  /* 異常系 */
  it('パスワードが短すぎるなどバリデーションエラーを返す', async () => {

    // supertestを使用してリクエスト
    const res = await request(appTest)
      .post('/api/auth/password/reset-password')
      .send({
        token: validToken,
        newPassword: '123',
      });

    // 検証
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('パスワードは最低6文字以上である必要があります');
  });
});