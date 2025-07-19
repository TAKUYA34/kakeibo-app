const { Parser } = require('json2csv'); // CSVデータ
const PDFDocument = require('pdfkit'); // PDFデータ
const path = require('path'); // パス操作
const ExportPDFAndCSVRepository = require('../repositories/exportPDFAndCSVRepository');

// 大項目データ
const majorSelMap = {
  income: '収支',
  expense: '支出'
};

// 中項目データ
const middleSelMap = {
  utility: '光熱費',
  rent: '家賃',
  food: '食費',
  dailyNecessities: '日用品費',
  education: '教育費',
  transportation: '交通費',
  beauty: '美容費',
  gasoline: 'ガソリン費',
  communication: '通信費',
  medicalCare: '医療費',
  insurance: '保険費',
  diningOut: '外食費',
  entertainment: '娯楽費',
  hobby: '趣味費',
  special: '特別費',
  salary: '給料',
  bonus: 'ボーナス',
  other: 'その他'
};

async function generateExportFile(userId, year, month, format) { // ID, 年, 出力形式
  const data = await ExportPDFAndCSVRepository.getExportTransactions(userId, year, month); // パイプラインデータ取得

  if (format === 'csv') {

    // CSV用に日本語へマッピング
    const mappedData = data.map(tx => ({
      trans_date: tx.trans_date ? tx.trans_date.toISOString().slice(0, 10) : '',
      major_sel: majorSelMap[tx.major_sel] || tx.major_sel,
      middle_sel: middleSelMap[tx.middle_sel] || tx.middle_sel,
      minor_sel: tx.minor_sel || '',
      memo: tx.memo || '',
      amount: tx.amount,
      total_amount: tx.total_amount
    }));

    const fields = ['trans_date', 'major_sel', 'middle_sel', 'minor_sel', 'memo', 'amount', 'total_amount']; // データ
    const parser = new Parser({ fields }); // CSVに変換
    return Buffer.from(parser.parse(mappedData), 'utf-8'); // バイナリデータに変換
  }

  if (format === 'pdf') {
    const doc = new PDFDocument(); // PDFDocument() = PDFを1枚ずつ作成できるライブラリ
    const buffers = []; // 一時保存場所

    doc.on('data', buffers.push.bind(buffers)); // データを生成したらbuffersに格納する

    // 日本語フォント
    const fontPath = path.join(__dirname, '../fonts/NotoSansCJKjp-Regular.otf'); // __dirname = 現在のディレクトリ
    doc.registerFont('jp', fontPath);
    doc.font('jp');

    const monthLabel = month ? `${month}月` : '年間';
    doc.fontSize(16).text(`${year}年 ${monthLabel} 家計簿データ`, { align: 'center' }).moveDown(); // ヘッダーフォーマットカスタマイズ

    // 詳細データのフォーマットカスタマイズ
    data.forEach(tx => {
      const majorLabel = majorSelMap[tx.major_sel] || tx.major_sel; // マッピングあれば変換、なければそのまま
      const middleLabel = middleSelMap[tx.middle_sel] || tx.middle_sel;
      doc
        .fontSize(10)
        .text(`日付: ${tx.trans_date.toISOString().slice(0, 10)} | 大項目: ${majorLabel} | 中項目: ${middleLabel} | 小項目: ${tx.minor_sel} | 金額: ${tx.amount} | 合計金額: ${tx.total_amount} | メモ: ${tx.memo || ''}`);
    });

    doc.end();

    return await new Promise((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(buffers))); // PDF結合完了
      doc.on('error', reject);
    });
  }

  throw new Error('未対応のフォーマットです');
}

// 年月のオプションを取得
async function fetchDateOptions(userId) {
  const dates = await ExportPDFAndCSVRepository.getTransactionDates(userId);

  const yearMonthSet = new Set();

  dates.forEach(({ trans_date }) => { // ← ここ修正
    if (!trans_date) return;
    const d = new Date(trans_date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    yearMonthSet.add(`${year}-${month}`);
  });

  const yearMonthArray = Array.from(yearMonthSet).map(item => {
    const [year, month] = item.split('-');
    return { year: parseInt(year), month: parseInt(month) };
  });

  return yearMonthArray.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return a.month - b.month;
  });
}

module.exports = {
  generateExportFile,
  fetchDateOptions
}