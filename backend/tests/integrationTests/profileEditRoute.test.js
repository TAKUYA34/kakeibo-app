const mongoose = require('mongoose');
const request = require('supertest');
const appTest = require('../testServer/app.test');
const UserTest = require('../../models/User');
const bcrypt = require('bcrypt');

describe('PUT /api/home/profile/edit', () => {
  let token, userId, otherUserId;

  beforeAll(async () => {
    // 実行前にDBの保存先を指定する
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/integration_test');
  });

  beforeEach(async () => {
    // 検証したらテーブル削除
    await UserTest.deleteMany({});

    // 固定ID
    const fixedUserId = new mongoose.Types.ObjectId('64a000000000000000000001');
    const otherFixedId = new mongoose.Types.ObjectId('64a000000000000000000002');

    // メインのテストユーザー
    const user = await UserTest.create({
      _id: fixedUserId,
      user_name: 'TestUser',
      email: 'test@example.com',
      password: await bcrypt.hash('originalpass', 10),
    });
    userId = user._id.toString();
    // ダミーtoken生成
    token = userId;

    // 重複用ユーザーデータ
    const otherUser = await UserTest.create({
      _id: otherFixedId,
      user_name: 'OtherUser',
      email: 'other@example.com',
      password: await bcrypt.hash('pass1234', 10),
    });
    otherUserId = otherUser._id.toString();
  });

  // 検証後、DBを削除し接続をクローズする
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  /* 正常系 */
  it('ユーザーデータが正常に更新される', async () => {
    // supertestを使用してリクエスト
    const res = await request(appTest)
      .put('/api/home/profile/edit')
      .set('Authorization', `Bearer ${token}`)
      .send({
        user_name: 'UpdatedUser',
        email: 'updated@example.com',
        password: 'newsecurepass',
      });
    
    // 検証
    expect(res.statusCode).toBe(200);
    // ちゃんと更新されていることを確認する
    expect(res.body.user.user_name).toBe('UpdatedUser');
    expect(res.body.user.email).toBe('updated@example.com');
  });

  /* 異常系 */
  it('ユーザーが存在しない場合はエラーを返す', async () => {
    // 偽ID
    const fakeId = new mongoose.Types.ObjectId('64a000000000000000000003');

    // supertestを使用してリクエスト
    const res = await request(appTest)
      .put('/api/home/profile/edit')
      .set('Authorization', `Bearer ${fakeId}`)
      .send({
        user_name: 'InvalidUser',
        email: 'invalid@example.com',
        password: 'newpass',
      });

    // 検証
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toContain('ユーザーが見つかりません');
  });

  /* 異常系 */
  it('メールアドレスが他ユーザーと重複している場合はエラーを返す', async () => {
    // supertestを使用してリクエスト
    const res = await request(appTest)
      .put('/api/home/profile/edit')
      .set('Authorization', `Bearer ${token}`)
      .send({
        user_name: 'DuplicateEmailUser',
        email: 'other@example.com', // 重複
        password: 'uniquepass',
      });

    // 検証
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toContain('そのメールアドレスは既に使用されています');
  });

  /* 異常系 */
  it('パスワードが以前と同じ場合はエラーを返す', async () => {
    const res = await request(appTest)
      .put('/api/home/profile/edit')
      .set('Authorization', `Bearer ${token}`)
      .send({
        user_name: 'SamePassUser',
        email: 'same@example.com',
        password: 'originalpass', // 同じパスワード
      });

    // 検証
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toContain('以前と同じパスワードは使用できません');
  });

  describe('DELETE /api/home/profile/delete', () => {
    /* 正常系 */
    it('ユーザーデータが正常に削除される', async () => {
      // supertestを使用してリクエスト
      const res = await request(appTest)
        .delete('/api/home/profile/delete')
        .set('Authorization', `Bearer ${token}`); // 認証トークンを設定
      
      // 検証
      expect(res.statusCode).toBe(200);
      // ちゃんと更新されていることを確認する
      expect(res.body.message).toBe('アカウントを削除しました');
    });

    /* 異常系 */
    it('存在しないユーザーの場合はエラーを返す', async () => {
      // 偽ID
      const fakeId = new mongoose.Types.ObjectId().toString();

      // supertestを使用してリクエスト
      const res = await request(appTest)
        .delete('/api/home/profile/delete')
        .set('Authorization', `Bearer ${fakeId}`);

      // 検証
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toContain('ユーザーが見つかりませんでした');
    });
  });
});