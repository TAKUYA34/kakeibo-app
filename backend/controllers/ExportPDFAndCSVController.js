const ExportPDFAndCSVService = require('../services/exportPDFAndCSVService');

/* 年、月、形式ごとにデータを取得する */
async function exportData(req, res) {
  try {
    const { year, month, format } = req.query; // 年、月、形式を取得
    const userId = req.user.id; // id

    // 年、月、フォーマット未指定
    if (!year || !format) {
      return res.status(400).json({ message: '年と形式は必須です、選択してください' });
    }

    // フォーマットの検証
    const fileBuffer = await ExportPDFAndCSVService.generateExportFile(userId, year, month, format);
    // console.log('back', fileBuffer);

    // 設定、自動ダウンロード
    const paddedMonth = month != null ? String(month).padStart(2, '0') : '';
    const fileName = `summary_${year}${paddedMonth ? `_${paddedMonth}` : ''}.${format}`;

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`); // 月を2桁で表示
    res.setHeader('Content-Type', format === 'csv' ? 'text/csv; charset=utf-8' : 'application/pdf'); // 形式に応じてContent-Typeを設定
    res.send(fileBuffer);
  } catch (error) {
    // console.error('エクスポートエラー:', error);
    res.status(500).json({ message: 'エクスポートに失敗しました', error: error.message });
  }
}

/* 年月のオプションを取得 */
async function getDateOptions(req, res) {
  try {
    const userId = req.user.id;
    const options = await ExportPDFAndCSVService.fetchDateOptions(userId);
    // console.log('back', options);
    res.json(options);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: 'サーバーエラー' });
  }
}

module.exports = {
  exportData,
  getDateOptions
};               