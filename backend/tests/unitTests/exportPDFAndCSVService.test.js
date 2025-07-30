const ExportPDFAndCSVServiceTest = require('../../services/exportPDFAndCSVService');
const ExportPDFAndCSVRepositoryTest = require('../../repositories/exportPDFAndCSVRepository');

// モック準備
jest.mock('../../repositories/exportPDFAndCSVRepository');

/* generateExportFile 正常系 */
describe('generateExportFile', () => {
  // 引数
  const userId = 'dummyUser45', year = 2025, month = 5;

  const dummyData = [
    {
      trans_date: new Date('2025-05-01'),
      major_sel: 'expense',
      middle_sel: 'food',
      minor_sel: 'ランチ',
      memo: 'メモA',
      amount: 1000,
      total_amount: 1000
    },
    {
      trans_date: new Date('2025-05-15'),
      major_sel: 'expense',
      middle_sel: 'food',
      minor_sel: 'ディナー',
      memo: 'メモB',
      amount: 2000,
      total_amount: 3000
    }
  ];

  it('CSVが正常に出力される', async () => {
    // モック
    ExportPDFAndCSVRepositoryTest.getExportTransactions.mockResolvedValue(dummyData);

    // CSVに変換
    const buf = await ExportPDFAndCSVServiceTest.generateExportFile(userId, year, month, 'csv');

    // 検証
    expect(Buffer.isBuffer(buf)).toBe(true);
    const csvStr = buf.toString('utf8');
    expect(csvStr).toContain('支出') // majorSelMap を反映
    expect(csvStr).toContain('食費') // middleSelMap を反映
    expect(csvStr).toContain('1000');
  });

  it('PDFが正常に出力される', async () => {
    // モック
    ExportPDFAndCSVRepositoryTest.getExportTransactions.mockResolvedValue(dummyData);

    // PDFに変換
    const buf = await ExportPDFAndCSVServiceTest.generateExportFile(userId, year, month, 'pdf');

    // 検証
    expect(Buffer.isBuffer(buf)).toBe(true);
    const txt = buf.slice(0, 4).toString('utf8');
    expect(txt).toBe('%PDF'); // PDF ヘッダー確認
  });
});

/* generateExportFile 異常系 */
describe('generateExportFile', () => {
  // 引数
  const userId = 'dummyUser45', year = 2025, month = 5;

  it('不正のformatを指定した場合、例外スロー', async () => {
    // 検証
    await expect(ExportPDFAndCSVServiceTest.generateExportFile(userId, year, month, 'xml'))
      .rejects.toThrow('未対応のフォーマットです');
  });

  it('DB取得失敗', async () => {
    // モック
    ExportPDFAndCSVRepositoryTest.getExportTransactions.mockRejectedValue(new Error('DB取得エラー'));

    // 検証
    await expect(ExportPDFAndCSVServiceTest.generateExportFile(userId, year, month, 'csv'))
      .rejects.toThrow('DB取得エラー');
  });
});

/* fetchDateOptions 正常系 */
describe('fetchDateOptions', () => {
  // 引数
  const userId = 'dummyUser';

  it('年月リストが反映される', async () => {
    // モック
    ExportPDFAndCSVRepositoryTest.getTransactionDates.mockResolvedValue([
      { trans_date: '2025-05-10' },
      { trans_date: '2024-12-20' },
      { trans_date: '2025-05-01' },
      { trans_date: null }
    ]);

    // 検証
    const result = await ExportPDFAndCSVServiceTest.fetchDateOptions(userId);
    expect(result).toEqual([
      { year: 2025, month: 5 },
      { year: 2024, month: 12 }
    ]);
  });
});

/* fetchDateOptions 異常系 */
describe('fetchDateOptions', () => {
  // 引数
  const userId = 'dummyUser';

  it('DB取得失敗', async () => {
    // モック
    ExportPDFAndCSVRepositoryTest.getTransactionDates.mockRejectedValue(new Error('DB取得エラー'));

    // 検証
    await expect(ExportPDFAndCSVServiceTest.fetchDateOptions(userId))
      .rejects.toThrow('DB取得エラー');
  });
});