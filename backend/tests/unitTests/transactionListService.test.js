/* transactionListService Test */
const transactionListServiceTest = require('../../services/transactionListService');
const transactionListRepositoryTest = require('../../repositories/transactionListRepository');

// dummyデータに置き換えて検証する
jest.mock('../../repositories/transactionListRepository');

/* extractYearsAndMonths 正常系テスト */
describe('extractYearsAndMonths', () => {

  it('重複を除いた年と月を取得する', async () => {
    // テストの中身
    const dummyTransactionData = [
      { trans_date: '2024-01-10' },
      { trans_date: '2024-03-15' },
      { trans_date: '2023-01-10' },
      { trans_date: '2024-01-10' }, // 重複データ
      { trans_date: '2023-12-01' },
    ];

    // ダミーデータ取得
    transactionListRepositoryTest.getAllTransactionDates.mockResolvedValue(dummyTransactionData);

    // 結果をresultへ
    const result = await transactionListServiceTest.extractYearsAndMonths();

    // 検証
    expect(result.years).toEqual([2024, 2023]); 
    expect(result.months).toEqual([1, 3, 12]);
  });
});

/* fetchMonthlyAggregateByCategory 正常系テスト */
describe('fetchMonthlyAggregateByCategory', () => {
  it('年とユーザーIDと紐づく集計結果を返す', async () => {
    // データ
    const dummyAggregate = [
      {
        major_sel: '食費',
        middle_sel: '外食',
        minor_sel: 'ランチ',
        monthly: [
          { month: 1, amount: 5000 },
          { month: 2, amount: 6000 }
        ],
        memos: [['牛丼'], ['ラーメン']]
      }
    ];

    // 引数データ
    const userId = 'dummyUser45';
    const year = 2025;

    // ダミーデータ取得
    transactionListRepositoryTest.aggregateMonthlyByCategory.mockResolvedValue(dummyAggregate);

    // 結果をresultへ
    const result = await transactionListServiceTest.fetchMonthlyAggregateByCategory(year, userId);

    // 検証
    expect(transactionListRepositoryTest.aggregateMonthlyByCategory).toHaveBeenCalledWith(year, userId);
    expect(result).toEqual(dummyAggregate);

  })
})


/* extractYearsAndMonths 異常系テスト */
describe('extractYearsAndMonths', () => {
  it('不正な日付を無視する', async () => {
    const dummyTransactionData = [
      { trans_date: '2024-02-01' },
      { trans_date: 'invalid-date' },
      { trans_date: null },
      { trans_date: undefined },
    ];
    // ダミーデータ取得
    transactionListRepositoryTest.getAllTransactionDates.mockResolvedValue(dummyTransactionData);

    // 結果をresultへ
    const result = await transactionListServiceTest.extractYearsAndMonths();

    // 検証
    expect(result.years).toEqual([2024]);
    expect(result.months).toEqual([2]);
  });

  it('extractYearsAndMonths サーバーエラー', async () => {
    transactionListRepositoryTest.getAllTransactionDates.mockResolvedValue(new Error('DB接続失敗'));

    // DB接続失敗
    await expect(transactionListServiceTest.extractYearsAndMonths()).rejects.toThrow('DB接続失敗');
  })
});

/* fetchMonthlyAggregateByCategory 異常系テスト */
describe('fetchMonthlyAggregateByCategory', () => {

  it('userIdがnullでも集計は動く（全ユーザー分）', async () => {
    const dummyResult = [
      {
        major_sel: '交際費',
        middle_sel: '飲み会',
        minor_sel: 'ビール',
        monthly: [{ month: 3, amount: 3000 }],
        memos: [['乾杯']]
      }
    ];

    // 引数データ
    const nullUserId = null;
    const year = 2025;

    // ダミーデータを取得
    transactionListRepositoryTest.aggregateMonthlyByCategory.mockResolvedValue(dummyResult);
  
    // 結果をresultへ
    const result = await transactionListServiceTest.fetchMonthlyAggregateByCategory(year, nullUserId);
    console.log(result);
  
    // 検証
    expect(transactionListRepositoryTest.aggregateMonthlyByCategory).toHaveBeenCalledWith(year, nullUserId);
    expect(result).toEqual(dummyResult);
  });

  it('fetchMonthlyAggregateByCategory サーバーエラー', async () => {
    transactionListRepositoryTest.aggregateMonthlyByCategory.mockRejectedValue(new Error('DB集計失敗'));

    // 引数データ
    const userId = 'dummyUser45';
    const year = 2025;

    // DB接続失敗
    await expect(
      transactionListServiceTest.fetchMonthlyAggregateByCategory(year, userId)
    ).rejects.toThrow('DB集計失敗');  
  });  
});

