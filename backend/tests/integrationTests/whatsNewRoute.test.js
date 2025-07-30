const request = require('supertest');
const mongoose = require('mongoose');
const appTest = require('../testServer/app.test'); // テスト用
const NoticeTest = require('../../models/Notice');

/* end API */
describe('GET /api/home/notices', () => {
  let dummyUserId;

  // 実行前にDBの保存先を指定する
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/integration_test');
  });

  // ダミーデータをセット
  beforeEach(async () => {
    await NoticeTest.deleteMany({});
    dummyUserId = new mongoose.Types.ObjectId();

    // ダミーデータ
    await NoticeTest.insertMany([
      { user_id: dummyUserId, title: 'お知らせ1', content: '内容1', notice_date: new Date() },
      { user_id: dummyUserId, title: 'お知らせ2', content: '内容2', notice_date: new Date() },
      { user_id: dummyUserId, title: 'お知らせ3', content: '内容3', notice_date: new Date() },
      { user_id: dummyUserId, title: 'お知らせ4', content: '内容4', notice_date: new Date() }
    ]);
  });

  // 実行毎に初期化する
  afterAll(async () => {
    await mongoose.disconnect();
  });

  /* 正常系 */
  it('3件のお知らせとtotalCountを返す', async () => {
    // supertestを使用してリクエスト
    const res = await request(appTest)
      .get('/api/home/notices?page=1&limit=3');

    // 検証
    expect(res.statusCode).toBe(200); // ステータスコード
    expect(res.body.notices).toHaveLength(3); // 3件取得
    expect(typeof res.body.totalCount).toBe('number'); // 合計件数（Number型）
    expect(res.body.totalCount).toBeGreaterThanOrEqual(4); // 最低4件以上DBに登録されているか
  });

  /* 異常系 */
  it('DB接続エラーが起きたら500を返す', async () => {
    await mongoose.disconnect(); // 強制的にエラー

    // supertestを使用してリクエスト
    const res = await request(appTest)
      .get('/api/home/notices?page=1&limit=3');

    // 検証
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('message', 'サーバーエラー: お知らせの取得に失敗しました');

    // 検証後、DBを元に戻す
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/integration_test');
  });
});