const adminReportDataServiceTest = require('../../services/adminReportDataService');
const adminReportDataRepositoryTest = require('../../repositories/adminReportDataRepository');
const adminReportDataMapperTest = require('../../mappers/adminReportDataMapper');

// モックデータ
const mockNotice = {
  _id: 'test123',
  title: 'テストタイトル',
  content: 'テスト内容',
  createdAt: new Date(),
};

// モックデータ
const mappedNotice = {
  id: 'test123',
  title: 'テストタイトル',
  content: 'テスト内容',
  createdAt: expect.any(Date),
};

// モック化
jest.mock('../../repositories/adminReportDataRepository');
jest.mock('../../mappers/adminReportDataMapper');

// 検証後、履歴をリセット
beforeEach(() => {
  jest.clearAllMocks();
});

/* fetchPaginatedAllNotices 正常系 */
describe('fetchPaginatedAllNotices', () => {
  it('ページ付きのお知らせ一覧を返す', async () => {
    // モック
    adminReportDataRepositoryTest.getFetchPaginatedNotices.mockResolvedValue([mockNotice]);
    adminReportDataRepositoryTest.getCountNoticesAll.mockResolvedValue(1);

    // 取得
    const result = await adminReportDataServiceTest.fetchPaginatedAllNotices(1, 5);

    // 検証
    expect(result).toEqual({
      notices: [mockNotice],
      total: 1,
      page: 1,
      totalPages: 1
    });
  });
});

/* fetchPaginatedAllNotices 異常系 */
describe('fetchPaginatedAllNotices', () => {
  it('お知らせが取得できなかった場合はエラーを投げる', async () => {
    // モック
    adminReportDataRepositoryTest.getFetchPaginatedNotices.mockResolvedValue(null);

    // 検証
    await expect(
      adminReportDataServiceTest.fetchPaginatedAllNotices(1, 5)
    ).rejects.toThrow('お知らせのデータが見つかりません');
  });
});

/* registerNotice 正常系 */
describe('registerNotice', () => {
  it('新しいお知らせを登録し、整形されたデータを返す', async () => {
    // モック
    adminReportDataRepositoryTest.createNoticeData.mockResolvedValue(mockNotice);
    adminReportDataMapperTest.mapToNoticeDao.mockReturnValue(mappedNotice);

    // 登録
    const result = await adminReportDataServiceTest.registerNotice({ title: 'test' });

    // 検証
    expect(result).toEqual(mappedNotice);
  });
});

/* registerNotice 異常系 */
describe('registerNotice', () => {
  it('データが作成されなかった場合はエラーを投げる', async () => {
    // モック
    adminReportDataRepositoryTest.createNoticeData.mockResolvedValue(null);

    // 検証
    await expect(
      adminReportDataServiceTest.registerNotice({ title: 'test' })
    ).rejects.toThrow('formデータがありません');
  });
});

/* updateNotice 正常系 */
describe('updateNotice', () => {
  it('お知らせを更新し、整形されたデータを返す', async () => {
    // モック
    adminReportDataRepositoryTest.updateNoticeData.mockResolvedValue(mockNotice);
    adminReportDataMapperTest.mapToNoticeDao.mockReturnValue(mappedNotice);

    // 更新
    const result = await adminReportDataServiceTest.updateNotice('test123', { title: 'updated' });

    // 検証
    expect(result).toEqual(mappedNotice);
  });
});

/* updateNotice 異常系 */
describe('updateNotice', () => {
  it('データが存在しない場合はエラーを投げる', async () => {
    // モック
    adminReportDataRepositoryTest.updateNoticeData.mockResolvedValue(null);

    // 検証
    await expect(
      adminReportDataServiceTest.updateNotice('test123', { title: 'updated' })
    ).rejects.toThrow('更新元のデータがありません');
  });
});


/* removeNotice 正常系 */
describe('removeNotice', () => {
  it('お知らせを削除する', async () => {
    // モック
    adminReportDataRepositoryTest.deleteNoticeData.mockResolvedValue({ deletedCount: 1 });

    // 削除
    const result = await adminReportDataServiceTest.removeNotice('test123');

    // 検証
    expect(result).toEqual({ deletedCount: 1 });
  });
});

/* removeNotice 異常系 */
describe('removeNotice', () => {
  it('DB接続エラーが起きた場合', async () => {
    // モック
    adminReportDataRepositoryTest.deleteNoticeData.mockRejectedValue(new Error('DB接続エラー'));

    // 検証
    await expect(
      adminReportDataServiceTest.removeNotice('test123')
    ).rejects.toThrow('DB接続エラー');
  });
});
