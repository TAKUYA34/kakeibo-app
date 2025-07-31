const request = require('supertest');
const mongoose = require('mongoose');
const appTest = require('../testServer/app.test');
const TransactionTest = require('../../models/Transaction');
const CategoryTest = require('../../models/Category');
const UserTest = require('../../models/User');
const transactionAddTestMapper = require('../testMapper/transactionAddTestMapper');

/* 家計簿データ登録画面 API */
describe('POST api/transactions/add/register', () => {
  let userId;

  // 実行前にDBの保存先を指定する
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/integration_test');

    // ダミーユーザー登録
    const user = await UserTest.create({
      _id: new mongoose.Types.ObjectId("688aa76704c50cbbd9a78652"),
      user_name: 'test_user',
      email: 'test@example.com',
      password: 'hashedpassword' // パスワード不要ならダミーでOK
    });
    userId = user._id;
  });

  // 実行前に履歴をリセット
  beforeEach(async () => {
    await TransactionTest.deleteMany({ user_id: userId });
  });

  // 実行後も履歴をリセット
  afterEach(async () => {
    await TransactionTest.deleteMany({ user_id: userId });
  });

  // 検証後はDB削除し閉じる
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  /* 正常系 */
  it('月をまたいだ時に、total_amountが初期化される', async () => {
    // 前月の取引（例: 2025年6月末）
    const juneTransaction = [{
      transaction_id: new mongoose.Types.ObjectId().toString(),
      date: new Date('2025-06-30'),
      trans_type: 'expense',
      price: 3000,
      amount: -3000,
      memo: '6月支出',
      major_sel: '娯楽',
      middle_sel: 'ゲーム',
      minor_sel: 'Steam',
      trans_date: new Date('2025-06-30'),
    }];

    const mappedJune = juneTransaction.map(transactionAddTestMapper.mapTestTransactionToExpectedFormat);

    // 6月の取引を登録（累積開始）
    const resJune = await request(appTest)
      .post('/api/transactions/add/register')
      .send({ transactions: mappedJune, userId: userId.toString() });

    expect(resJune.statusCode).toBe(200);

    // 翌月（7月）の取引を登録
    const julyTransaction = [{
      transaction_id: new mongoose.Types.ObjectId().toString(),
      trans_type: 'expense',
      price: 1000,
      amount: -1000,
      memo: '7月支出',
      major_sel: '食費',
      middle_sel: '外食',
      minor_sel: 'カフェ',
      trans_date: new Date('2025-07-01'),
    }];

    const mappedJuly = julyTransaction.map(transactionAddTestMapper.mapTestTransactionToExpectedFormat);

    // 7月の取引を登録（累積開始）
    const resJuly = await request(appTest)
      .post('/api/transactions/add/register')
      .send({ transactions: mappedJuly, userId: userId.toString() });

    // 検証
    expect(resJuly.statusCode).toBe(200);
    expect(resJuly.body.transactions).toHaveLength(1);

    const savedJuly = resJuly.body.transactions[0];

    // → total_amount が -1000 でリセットスタートしていることを確認
    expect(savedJuly.total_amount).toBe(-1000);
  });

  /* 正常系 */
  it('家計簿データを1件登録できる', async () => {
    
    // 登録するデータ
    const testTransaction = [
      {
        transaction_id: new mongoose.Types.ObjectId().toString(),
        category_id: new mongoose.Types.ObjectId("688aa76704c50cbbd9a78653"),
        trans_type: "expense",
        price: 1000,
        amount: -1000,
        memo: "ラーメン",
        major_sel: "食費",
        middle_sel: "外食",
        minor_sel: "ランチ",
        trans_date: new Date('2025-03-01')
      }
    ];

    // マッピングして送信フォーマットに変換する
    const mappedTestTransactions = testTransaction.map(transactionAddTestMapper.mapTestTransactionToExpectedFormat);

    // supertestを使用してリクエスト
    const res = await request(appTest)
      .post('/api/transactions/add/register')
      .send({
        transactions: mappedTestTransactions,
        userId: userId.toString()
      });

    // 検証
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', '登録成功しました！');
    expect(res.body).toHaveProperty('transactions');
    expect(Array.isArray(res.body.transactions)).toBe(true);
    expect(res.body.transactions[0].memo).toBe('ラーメン');

    // DBにも保存されているか確認
    const saved = await TransactionTest.findOne({ user_id: userId });
    expect(saved).not.toBeNull();
    expect(saved.memo).toBe('ラーメン');
  });

  /* 正常系 */
  it('新しいカテゴリが存在しない場合はカテゴリを作成し、トランザクションに結びつけて保存できる', async () => {
    // transactionデータ（require: true のみ）
    const transaction = [{
      trans_type: 'expense',
      price: '1000',
      amount: -1000,
      trans_date: new Date('2025-06-15'),
      type: 'expense',
      major: '交通費',
      middle: 'バス',
      minor: 'バス移動'
    }];

    // supertestを使用してリクエスト
    const res = await request(appTest)
      .post('/api/transactions/add/register')
      .send({ transactions: transaction, userId });

      console.log('res.statusCode:', res.statusCode);
      console.log('res.body:', res.body);

    // カテゴリデータを保存
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('transactions');
    expect(res.body.transactions).toHaveLength(1);

    // 1行取得
    const savedTx = res.body.transactions[0];

    // カテゴリ情報が登録されているか確認
    const categoryRes = await CategoryTest.findOne({
      user_id: userId,
      category_type: 'expense',
      category_major: '交通費',
      category_middle: 'バス',
      category_minor: 'バス移動'
    });

    // nullチェック
    expect(categoryRes).not.toBeNull();
    expect(savedTx.category_id).toEqual(categoryRes._id.toString());
  });

  /* 異常系 */
  it('userIdが無い場合は400エラーを返す', async () => {
    const res = await request(appTest)
      .post('/api/transactions/add/register')
      .send({
        transactions: []
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('ユーザーIDが見つかりません。');
  });
});