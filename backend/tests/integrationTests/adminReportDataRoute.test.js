const request = require('supertest');
const mongoose = require('mongoose');
const appTest = require('../testServer/app.test');
const UserTest = require('../../models/User');
const NoticeTest = require('../../models/Notice');

/* お知らせデータを新規登録する */
describe('POST /api/admin/notices/register', () => {
  let noticeId;

  // テスト前の準備
  beforeAll(async () => {
    // 実行前にDBの保存先を指定する
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/integration_test');

    // テスト用ユーザー作成
    testAdminUser = await UserTest.create({
      user_name: 'testadminuser',
      email: 'testadmin@example.com',
      password: 'adminhashedpassword', // パスワードハッシュ済みを想定
      role: 'admin'
    });
  });

  // 検証が完了したらDB削除
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  /* 正常系 */
  it('お知らせデータの新規投稿ができる', async () => {
    // supertestを使用してリクエスト
    const res = await request(appTest)
      .post('/api/admin/notices/register')
      .send({
        user_id: testAdminUser._id,
        title: 'お知らせテストタイトル',
        content: 'これはテスト内容です。',
        notice_date: new Date('2025-7-20')
      });

    // 検証
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('title', 'お知らせテストタイトル');
    expect(res.body).toHaveProperty('content', 'これはテスト内容です。');
    noticeId = res.body._id;
  });

    /* 異常系 */
  it('お知らせデータが空の場合、エラー', async () => {
    // supertestを使用してリクエスト
    const res = await request(appTest)
      .post('/api/admin/notices/register')
      .send({}); // 空

    // 検証
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('お知らせの作成に失敗しました');
  });

  /* ページ数制限付きで全件取得 */
  describe('GET /api/admin/report/notices/all', () => {
    /* 正常系 */
    it('お知らせ一覧を取得できる', async () => {
      // supertestを使用してリクエスト
      const res = await request(appTest)
        .get('/api/admin/notices/all')
        .query({ page: 1, limit: 10 });
  
      // 検証
      expect(res.statusCode).toBe(200);
      // お知らせが1件以上あるか
      expect(res.body.notices.length).toBeGreaterThan(0);
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('page', 1);
    });

    /* 正常系 */
    it('お知らせデータがない場合、空配列が返る', async () => {
      // 一度削除する
      await NoticeTest.deleteMany({});

      // supertestを使用してリクエスト
      const res = await request(appTest)
        .get('/api/admin/notices/all')
        .query({ page: 1, limit: 10 });

      // 検証
      expect(res.statusCode).toBe(200);
      expect(res.body.notices).toEqual([]);

      // お知らせデータを元に戻す
      const newNotice = await NoticeTest.create({
        user_id: testAdminUser._id,
        title: 'お知らせテストタイトル',
        content: 'これはテスト内容です。',
        notice_date: new Date('2025-7-20')
      });

      noticeId = newNotice._id;
    });
  });

  /* お知らせデータを更新する */
  describe('PUT /api/admin/notices/edit/:id', () => {
    /* 正常系 */
    it('投稿内容を編集できる', async () => {
      // supertestを使用してリクエスト
      const res = await request(appTest)
        .put(`/api/admin/notices/edit/${noticeId}`)
        .send({
          user_id: testAdminUser._id,
          title: '編集後タイトル',
          content: '編集後の内容です。',
          notice_date: new Date('2025-7-20')
        });

      // 検証
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('title', '編集後タイトル');
      expect(res.body).toHaveProperty('content', '編集後の内容です。');
    });

    /* 異常系 */
    it('ユーザーIDが無い状態で更新した場合エラーになる', async () => {
      // supertestを使用してリクエスト
      const res = await request(appTest)
        .put('/api/admin/notices/edit/')
        .send({
          user_id: testAdminUser._id,
          title: '編集後タイトル',
          content: '編集後の内容です。',
          notice_date: new Date('2025-7-20')
        });

      // 検証
      // :idが無いのでルーティングエラー
      expect(res.statusCode).toBe(404);
    });
  });

  /* お知らせデータを削除する */
  describe('DELETE /api/admin/notices/delete/:id', () => {
    /* 正常系 */
    it('投稿を削除できる', async () => {
      // supertestを使用してリクエスト
      const res = await request(appTest)
        .delete(`/api/admin/notices/delete/${noticeId}`);
  
      // 検証
      // 削除成功
      expect(res.statusCode).toBe(204);
    });

        /* 異常系 */
    it('ユーザーIDが無い状態で削除した場合エラーになる', async () => {
      // supertestを使用してリクエスト
      const res = await request(appTest)
        .delete('/api/admin/notices/delete/')

      // 検証
      // :idが無いのでルーティングエラー
      expect(res.statusCode).toBe(404);
    });
  });
});