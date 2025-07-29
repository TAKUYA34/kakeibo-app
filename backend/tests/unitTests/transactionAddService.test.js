/* transactionListService Test */
const transactionAddServiceTest = require('../../services/transactionAddService');
const transactionAddRepositoryTest = require('../../repositories/transactionAddRepository');
const transactionAddMapperTest = require('../../mappers/transactionAddMapper');

// dummyデータに置き換えて検証する
jest.mock('../../repositories/transactionAddRepository');
jest.mock('../../mappers/transactionAddMapper');

/* toAddUserTransactions 正常系テスト */
describe('toAddUserTransactions', () => {
  // 検証毎にクリア
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('家計簿データが正常に登録される', async () => {
    // テストの中身
    const dummyTransactionsData = [
      {
        trans_date: '2025-05-05',
        amount: 1000,
        major: 'expense',
        middle: '食費',
        minor: 'ランチ'
      },
      {
        trans_date: '2025-05-10',
        amount: 2000,
        major: 'expense',
        middle: '食費',
        minor: 'ディナー'
      }
    ];

    // 引数データ
    const userId = 'dummyUser45';
    const dummyCategory = { _id: 'category123' };
    const dummyMappedTx1 = { trans_date: new Date('2025-05-05'), total_amount: 1000 };
    const dummyMappedTx2 = { trans_date: new Date('2025-05-10'), total_amount: 3000 };

    // ダミーデータ取得
    transactionAddRepositoryTest.getLatestTransactionByMonth.mockResolvedValue({ total_amount: 0 }); // 合計金額
    transactionAddRepositoryTest.findOrCreateCategory.mockResolvedValue(dummyCategory);
    // カテゴリデータ取得
    transactionAddMapperTest.mapToTransaction
      .mockReturnValueOnce(dummyMappedTx1)
      .mockReturnValueOnce(dummyMappedTx2);
    // DBに登録する
    transactionAddRepositoryTest.insertMany.mockResolvedValue([dummyMappedTx1, dummyMappedTx2]);

    // 結果をresultへ
    const result = await transactionAddServiceTest.toAddUserTransactions(dummyTransactionsData, userId);

    // 検証
    expect(transactionAddRepositoryTest.getLatestTransactionByMonth).toHaveBeenCalledTimes(1); // 同月の合計金額
    expect(transactionAddRepositoryTest.findOrCreateCategory).toHaveBeenCalledTimes(2); // カテゴリ生成
    expect(transactionAddRepositoryTest.insertMany).toHaveBeenCalledWith([dummyMappedTx1, dummyMappedTx2]); // 保存

    expect(result.initialTotal).toBe(3000); // 合計金額が3000であること
    expect(result.saved.length).toBe(2); // 登録件数
  });
});

/* toAddUserTransactions 異常系テスト */
describe('toAddUserTransactions', () => {
  // 検証毎にクリア
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 引数データ
  const userId = 'dummyUser45';

  it('金額がnullの場合、例外処理が実行される', async () => {
    const nullAmountData = [{ amount: null, category: 'food' }];

    await expect(transactionAddServiceTest.toAddUserTransactions(nullAmountData, userId)).rejects.toThrow('mapped失敗');
  });

  it('月初金額の取得に失敗したら、例外処理が実行される', async () => {

    const tx = [{
      amount: 1000,
      trans_date: '2025-07-01',
      major: 'expense',
      middle: 'food'
    }];

    transactionAddRepositoryTest.getLatestTransactionByMonth.mockRejectedValue(new Error('DB接続失敗'));

    await expect(
      transactionAddServiceTest.toAddUserTransactions(tx, userId)
    ).rejects.toThrow('DB接続失敗');
  });

  it('カテゴリの取得に失敗したら、例外処理が実行される', async () => {

    const tx = [{
      amount: 1000,
      trans_date: '2025-07-01',
      major: 'expense',
      middle: 'food'
    }];

    transactionAddRepositoryTest.getLatestTransactionByMonth.mockResolvedValue({ total_amount: 0 });
    transactionAddRepositoryTest.findOrCreateCategory.mockRejectedValue(new Error('カテゴリ取得失敗'));

    await expect(
      transactionAddServiceTest.toAddUserTransactions(tx, userId)
    ).rejects.toThrow('カテゴリ取得失敗');
  });

  it('mapToTransactionに失敗したら、例外処理が実行される', async () => {
    
    const tx = [{
      amount: 1000,
      trans_date: '2025-07-01',
      major: 'expense',
      middle: 'food'
    }];

    // モックの設定
    transactionAddRepositoryTest.getLatestTransactionByMonth.mockResolvedValue({ total_amount: 5000 });
    transactionAddRepositoryTest.findOrCreateCategory.mockResolvedValue({ _id: 'category123' });

     // mapToTransaction は例外を投げるようにする
    transactionAddMapperTest.mapToTransaction.mockImplementation(() => {
      throw new Error('カテゴリ変換に失敗');
    });

    await expect(
      transactionAddServiceTest.toAddUserTransactions(tx, userId)
      ).rejects.toThrow('カテゴリ変換に失敗');
  });

  it('DB登録に失敗したら、例外処理が実行される', async () => {
    const tx = [{
      amount: 1000,
      trans_date: '2025-07-01',
      major: 'expense',
      middle: 'food'
    }];

    transactionAddRepositoryTest.getLatestTransactionByMonth.mockResolvedValue({ total_amount: 0 });
    transactionAddRepositoryTest.findOrCreateCategory.mockResolvedValue({ _id: 'category123' });
    transactionAddMapperTest.mapToTransaction.mockReturnValue({
      user: userId,
      amount: 1000,
      trans_date: new Date('2025-07-01'),
      category: 'category123'
    });

    transactionAddRepositoryTest.insertMany.mockRejectedValue(new Error('DB書き込み失敗'));

    await expect(
      transactionAddServiceTest.toAddUserTransactions(tx, userId)
    ).rejects.toThrow('DB書き込み失敗');
  });
});

