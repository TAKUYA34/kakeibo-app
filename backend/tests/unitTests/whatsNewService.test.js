/* whatsNewService Test */
const whatsNewServiceTest = require('../../services/whatsNewService');
const whatsNewRepositoryTest = require('../../repositories/whatsNewRepository');

// dummyデータに置き換えて検証する
jest.mock('../../repositories/whatsNewRepository');

/* 正常系 */
describe('getNoticesByPage', () => {
  // 正常系
  it('追加完了しました', async () => {

    // テストの中身
    const dummyPageParams = { page: 1, limit: 5 };

    // モックデータ（お知らせの一覧）
    const dummyNotices = [
      { _id: 'abc123', title: 'お知らせ1', content: 'テスト内容' },
      { _id: 'abc124', title: 'お知らせ2', content: 'テスト内容2' },
    ];
    // モックの戻り値設定
    whatsNewRepositoryTest.getNoticesByPage.mockResolvedValue(dummyNotices);

    // 結果をresultへ
    const result = await whatsNewServiceTest.fetchNotices(dummyPageParams.page, dummyPageParams.limit);

    // 検証
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('お知らせ1');
    expect(whatsNewRepositoryTest.getNoticesByPage).toHaveBeenCalledWith(dummyPageParams.page, dummyPageParams.limit);
  });
});

/* 異常系 */
describe('fetchNotices', () => {
  it('page が null の場合にエラーを投げる', async () => {
    const page = null;
    const limit = 5;

    await expect(
      whatsNewServiceTest.fetchNotices(page, limit)
    ).rejects.toThrow('無効な入力です');
  });

  it('limit が null の場合にエラーを投げる', async () => {
    const page = 1;
    const limit = null;

    await expect(
      whatsNewServiceTest.fetchNotices(page, limit)
    ).rejects.toThrow('無効な入力です');
  });

  it('page が負数の場合にエラーを投げる', async () => {
    const page = -1;
    const limit = 5;

    await expect(
      whatsNewServiceTest.fetchNotices(page, limit)
    ).rejects.toThrow('無効な入力です');
  });

  it('limit が文字列の場合にエラーを投げる', async () => {
    const page = 1;
    const limit = 'ten';

    await expect(
      whatsNewServiceTest.fetchNotices(page, limit)
    ).rejects.toThrow('無効な入力です');
  });

  it('リポジトリが例外をスローした場合にエラーを返す', async () => {
    const page = 1;
    const limit = 5;

    whatsNewRepositoryTest.getNoticesByPage.mockImplementation(() => {
      throw new Error('DB接続失敗');
    });

    await expect(
      whatsNewServiceTest.fetchNotices(page, limit)
    ).rejects.toThrow('DB接続失敗');
  });
});