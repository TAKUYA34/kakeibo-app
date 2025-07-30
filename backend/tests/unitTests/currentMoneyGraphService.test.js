// tests/unitTests/currentMoneyGraphService.test.js
const transactionSummaryServiceTest = require('../../services/currentMoneyGraphService');
const transactionSummaryRepositoryTest = require('../../repositories/currentMoneyGraphRepository');

// リポジトリ層をモック
jest.mock('../../repositories/currentMoneyGraphRepository');

  // 引数
  const userId = 'user123';

  // 検証後に履歴をリセット
  afterEach(() => {
    jest.clearAllMocks();
  });

/* getMonthlySummary 正常系 */
describe('getMonthlySummary', () => {

  it('集計結果が正常に反映される', async () => {
    // 引数
    const dummyData = [
      { month: '2025-05', income: 100000, expense: 80000 },
      { month: '2025-06', income: 120000, expense: 90000 }
    ];

    // モック
    transactionSummaryRepositoryTest.aggregateMonthlySummary.mockResolvedValue(dummyData);

    // 検証
    const result = await transactionSummaryServiceTest.getMonthlySummary(userId);
    expect(transactionSummaryRepositoryTest.aggregateMonthlySummary).toHaveBeenCalledWith(userId);
    expect(result).toEqual(dummyData);
  });
});

/* getMonthlySummary 異常系 */
describe('getMonthlySummary', () => {
  
  it('DB接続エラー', async () => {
    // モック
    transactionSummaryRepositoryTest.aggregateMonthlySummary.mockRejectedValue(new Error('DB取得失敗'));

    // 検証
    await expect(transactionSummaryServiceTest.getMonthlySummary(userId)).rejects.toThrow('DB取得失敗');
  });
});

/* getCategorySummary 正常系 */
describe('getCategorySummary', () => {
  it('カテゴリ別集計結果が正常に反映される', async () => {
    // 引数
    const dummyData = [
      { category: '食費', total: 30000 },
      { category: '交通費', total: 10000 }
    ];

    // モック
    transactionSummaryRepositoryTest.aggregateCategorySummary.mockResolvedValue(dummyData);

    // 検証
    const result = await transactionSummaryServiceTest.getCategorySummary(userId);
    expect(transactionSummaryRepositoryTest.aggregateCategorySummary).toHaveBeenCalledWith(userId);
    expect(result).toEqual(dummyData);
  });
});

/* getCategorySummary 異常系 */
describe('getCategorySummary', () => {

  it('DB接続エラー', async () => {
    // モック
    transactionSummaryRepositoryTest.aggregateCategorySummary.mockRejectedValue(new Error('DB取得失敗'));

    // 検証
    await expect(transactionSummaryServiceTest.getCategorySummary(userId)).rejects.toThrow('DB取得失敗');
  });
});