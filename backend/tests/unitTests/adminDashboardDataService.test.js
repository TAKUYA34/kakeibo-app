const adminDashboardDataServiceTest = require('../../services/adminDashboardDataService');
const adminDashboardDataRepositoryTest = require('../../repositories/adminDashboardDataRepository');

// モック化
jest.mock('../../repositories/adminDashboardDataRepository');

// 検証後、履歴をリセットする
afterEach(() => jest.clearAllMocks());

/* fetchAllTransactions 正常系 */
describe('fetchAllTransactions', () => {
  it('全ての取引データ一覧を返す', async () => {
    // 引数
    const mockData = [{ id: 1 }, { id: 2 }];

    // モック
    adminDashboardDataRepositoryTest.findAllTransactions.mockResolvedValue(mockData);

    // 検証
    const result = await adminDashboardDataServiceTest.fetchAllTransactions();
    expect(result).toEqual(mockData);
  });
});

/* fetchAllTransactions 異常系 */
describe('fetchAllTransactions', () => {
  it('DB接続エラー', async () => {
    // モック
    adminDashboardDataRepositoryTest.findAllTransactions.mockRejectedValue(new Error('DB接続失敗'));

    // 検証
    await expect(adminDashboardDataServiceTest.fetchAllTransactions()).rejects.toThrow('DB接続失敗');
  });
});

/* fetchUserAndCategoryAndMemosSearch 正常系 */
describe('fetchUserAndCategoryAndMemosSearch', () => {
  it('各カテゴリ毎に条件検索できる', async () => {
    // 引数
    const filters = {
      name: '山田', category_major: '生活費',
      category_middle: ['食費'], category_minor: ['外食'],
      trans_date: '2025-07-01', memo: ['ランチ']
    };
    const expected = [{ id: 1 }];

    // モック
    adminDashboardDataRepositoryTest.keywordSearchTransactions.mockResolvedValue(expected);

    // 検証
    const result = await adminDashboardDataServiceTest.fetchUserAndCategoryAndMemosSearch(filters);
    expect(result).toEqual(expected);
  });
});

/* fetchUserAndCategoryAndMemosSearch 異常系 */
describe('fetchUserAndCategoryAndMemosSearch', () => {
  it('空の配列で返る', async () => {
    // モック
    adminDashboardDataRepositoryTest.keywordSearchTransactions.mockResolvedValue([]);

    // 検証
    const result = await adminDashboardDataServiceTest.fetchUserAndCategoryAndMemosSearch({});
    expect(result).toEqual([]);
  });

  it('DB接続エラー', async () => {
    // モック
    adminDashboardDataRepositoryTest.keywordSearchTransactions.mockRejectedValue(new Error('DB接続失敗'));

    // 検証
    await expect(adminDashboardDataServiceTest.fetchUserAndCategoryAndMemosSearch({})).rejects.toThrow('DB接続失敗');
  });
});

/* updateTransactionAndRecalculateTotal 正常系 */
describe('updateTransactionAndRecalculateTotal', () => {
  it('取引を更新して再計算する', async () => {
    // 引数
    const id = 'abc123';
    const updatedData = { amount: 100 };

    const originalTx = { _id: id, amount: 50, user_id: 'u1', trans_date: '2025-07-10' };
    const monthTx = [{ _id: id, amount: 100 }];

    // モック
    adminDashboardDataRepositoryTest.findTransactionById.mockResolvedValueOnce(originalTx); // fetch
    adminDashboardDataRepositoryTest.updateTransactionById.mockResolvedValue();
    adminDashboardDataRepositoryTest.findMonthlyTransactions.mockResolvedValue(monthTx);
    adminDashboardDataRepositoryTest.bulkUpdateAndDeleteTotalAmounts.mockResolvedValue();
    adminDashboardDataRepositoryTest.findTransactionById.mockResolvedValueOnce({ ...originalTx, amount: 100 }); // updated fetch
    adminDashboardDataRepositoryTest.findAllTransactionsByUserId.mockResolvedValue([originalTx]);

    // 検証
    const result = await adminDashboardDataServiceTest.updateTransactionAndRecalculateTotal(id, updatedData);
    expect(result).toEqual([originalTx]);
  });
});

/* updateTransactionAndRecalculateTotal 異常系 */
describe('updateTransactionAndRecalculateTotal', () => {
  it('更新するデータが存在しない場合にエラーを投げる', async () => {
    // モック
    adminDashboardDataRepositoryTest.findTransactionById.mockResolvedValue(null);

    // 検証
    await expect(adminDashboardDataServiceTest.updateTransactionAndRecalculateTotal('invalidId', {})).rejects.toThrow('取引するデータがありません');
  });

  it('DB接続エラー', async () => {
    // モック
    adminDashboardDataRepositoryTest.findTransactionById.mockRejectedValue(new Error('DB接続失敗'));

    // 検証
    await expect(adminDashboardDataServiceTest.updateTransactionAndRecalculateTotal('abc123', {})).rejects.toThrow('DB接続失敗');
  });
});

/* deleteTransactionAndRecalculateTotal 正常系 */
describe('deleteTransactionAndRecalculateTotal', () => {
  it('取引を削除して再計算', async () => {
    // 引数
    const id = 'tx1';
    const tx = { _id: id, user_id: 'u1', amount: 100, trans_date: '2025-07-10' };
    const monthTx = [{ _id: 'tx2', amount: 300 }];

    // モック
    adminDashboardDataRepositoryTest.findTransactionById.mockResolvedValue(tx);
    adminDashboardDataRepositoryTest.deleteTransactionById.mockResolvedValue();
    adminDashboardDataRepositoryTest.deleteAfterGetMonthTransactions.mockResolvedValue(monthTx);
    adminDashboardDataRepositoryTest.bulkUpdateAndDeleteTotalAmounts.mockResolvedValue();
    adminDashboardDataRepositoryTest.findAllTransactionsByUserId.mockResolvedValue([tx]);

    // 検証
    const result = await adminDashboardDataServiceTest.deleteTransactionAndRecalculateTotal(id);
    expect(result).toEqual([tx]);
  });
});

/* deleteTransactionAndRecalculateTotal 異常系 */
describe('deleteTransactionAndRecalculateTotal', () => {
  it('削除するデータが存在しない場合', async () => {
    // モック
    adminDashboardDataRepositoryTest.findTransactionById.mockResolvedValue(null);

    // 検証
    await expect(adminDashboardDataServiceTest.deleteTransactionAndRecalculateTotal('badId')).rejects.toThrow('取引するデータがありません');
  });

  it('削除に失敗した場合にエラーを投げる', async () => {
    // 引数
    const tx = { _id: 'tx1', user_id: 'u1', trans_date: '2025-07-10' };

    // モック
    adminDashboardDataRepositoryTest.findTransactionById.mockResolvedValue(tx);
    adminDashboardDataRepositoryTest.deleteTransactionById.mockRejectedValue(new Error('削除失敗'));

    // 検証
    await expect(adminDashboardDataServiceTest.deleteTransactionAndRecalculateTotal('tx1')).rejects.toThrow('削除失敗');
  });

  it('DB接続エラー', async () => {
    // モック
    adminDashboardDataRepositoryTest.findTransactionById.mockRejectedValue(new Error('DB接続失敗'));

    // 検証
    await expect(adminDashboardDataServiceTest.deleteTransactionAndRecalculateTotal('xxx')).rejects.toThrow('DB接続失敗');
  });
});

