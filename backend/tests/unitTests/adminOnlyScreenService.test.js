const adminOnlyScreenServiceTest = require('../../services/adminOnlyScreenService');
const adminOnlyScreenRepositoryTest = require('../../repositories/adminOnlyScreenRepository');

// モック化
jest.mock('../../repositories/adminOnlyScreenRepository');

// 検証後、履歴をリセットする
afterEach(() => {
  jest.clearAllMocks();
});

/* fetchUserAllSelectData 正常系 */
describe('fetchUserAllSelectData', () => {
  it('月別のデータとカテゴリ別のデータを返す', async () => {
    // 引数
    const monthlyMock = [{ month: '2025-07', income: 100000, expense: 80000 }];
    const categoryMock = [{ name: 'food', value: 30000 }];

    // モック
    adminOnlyScreenRepositoryTest.getMonthlySummary.mockResolvedValue(monthlyMock);
    adminOnlyScreenRepositoryTest.getCategoryBreakdown.mockResolvedValue(categoryMock);

    // 整形し、データ取得
    const result = await adminOnlyScreenServiceTest.fetchUserAllSelectData();

    // 検証
    expect(result.monthlyData).toEqual(monthlyMock);
    expect(result.categoryData).toEqual([{ name: '食費', value: 30000 }]);
  });
});

/* fetchUserAllSelectData 異常系 */
describe('fetchUserAllSelectData', () => {
  it('DB接続エラー', async () => {
    // モック
    adminOnlyScreenRepositoryTest.getMonthlySummary.mockRejectedValue(new Error('DB接続失敗'));

    // 検証
    await expect(adminOnlyScreenServiceTest.fetchUserAllSelectData()).rejects.toThrow('DB接続失敗');
  });
});

/* getUserAllStatsData 正常系 */
describe('getUserAllStatsData', () => {
  it('ユーザーの統計データを返す', async () => {
    // モック
    adminOnlyScreenRepositoryTest.getUsersAllCount.mockResolvedValue(100);
    adminOnlyScreenRepositoryTest.getMonthlyTransactionsCount.mockResolvedValue(2000);
    adminOnlyScreenRepositoryTest.getSumMonthlyExpenses.mockResolvedValue(80000);

    // 統計データ取得
    const result = await adminOnlyScreenServiceTest.getUserAllStatsData();

    // 検証
    expect(result).toEqual({
      totalUsers: 100,
      monthlyTransactions: 2000,
      monthlyExpense: 80000
    });
  });
});

/* getUserAllStatsData 異常系 */
describe('getUserAllStatsData', () => {
  it('全て0だった場合はダミーデータを返す', async () => {
    // モック
    adminOnlyScreenRepositoryTest.getUsersAllCount.mockResolvedValue(0);
    adminOnlyScreenRepositoryTest.getMonthlyTransactionsCount.mockResolvedValue(0);
    adminOnlyScreenRepositoryTest.getSumMonthlyExpenses.mockResolvedValue(0);

    // ダミーデータ取得
    const result = await adminOnlyScreenServiceTest.getUserAllStatsData();

    // 検証
    expect(result).toEqual({
      totalUsers: 120,
      monthlyTransactions: 3250,
      monthlyExpense: 110000
    });
  });

  it('DB接続エラー', async () => {
    // モック
    adminOnlyScreenRepositoryTest.getUsersAllCount.mockRejectedValue(new Error('DB接続失敗'));

    // 検証
    await expect(adminOnlyScreenServiceTest.getUserAllStatsData()).rejects.toThrow('DB接続失敗');
  });
});

