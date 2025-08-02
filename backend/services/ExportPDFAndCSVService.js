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

/* 家計簿データを取得し、CSVとPDFの形式にまとめる */
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

    // 月のデータを取得
    const monthLabel = month ? `${month}月` : '年間';

    // ヘッダー色を紺系に、行間を1.5に調整する
    doc
      .fontSize(18)
      .fillColor('#333399')
      .text(`${year}年 ${monthLabel} 家計簿データ`, { align: 'center' })
      .moveDown(1.5);

    // ヘッダー
    doc.fontSize(11).fillColor('#555')
      .text('日付', 50, doc.y, { continued: true, lineBreak: false })
      .text('大項目', 110, doc.y, { continued: true, lineBreak: false })
      .text('中項目', 170, doc.y, { continued: true, lineBreak: false })
      .text('小項目', 230, doc.y, { continued: true, lineBreak: false })
      .text('金額', 290, doc.y, { continued: true, lineBreak: false })
      .text('合計金額', 350, doc.y, { continued: true, lineBreak: false })
      .text('メモ', 430, doc.y ) // 最後はcontinued不要
      .moveDown(1);

    // データ行
    data.forEach((tx, i) => {
      const majorLabel = majorSelMap[tx.major_sel] || tx.major_sel;
      const middleLabel = middleSelMap[tx.middle_sel] || tx.middle_sel;
      const memoText = tx.memo || '';

      // カラム
      doc.fontSize(10).fillColor('black')
        .text(tx.trans_date.toISOString().slice(0, 10), 50, doc.y, { continued: true, lineBreak: false })
        .text(majorLabel, 110, doc.y, { continued: true, lineBreak: false })
        .text(middleLabel, 170, doc.y, { continued: true, lineBreak: false })
        .text(tx.minor_sel, 230, doc.y, { continued: true, lineBreak: false })
        .text(`${tx.amount}円`, 290, doc.y, { continued: true, lineBreak: false })
        .text(`${tx.total_amount}円`, 350, doc.y, { continued: true, lineBreak: false })
        .text(memoText, 430, doc.y ) // 最後はcontinued不要
        
      // 区切り線
      doc.moveDown(1).strokeColor('#ddd').lineWidth(0.3).moveTo(50, doc.y).lineTo(550, doc.y).stroke();

      // 改ページ処理
      if (doc.y > 750) {
        doc.addPage();
      }
    });

    doc.end();

    // 結合して出力する
    return await new Promise((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(buffers))); // PDF結合完了
      doc.on('error', reject);
    });
  }

  throw new Error('未対応のフォーマットです');
}

/* 年月のオプションを取得 */
async function fetchDateOptions(userId) {
  const dates = await ExportPDFAndCSVRepository.getTransactionDates(userId);

  const yearMonthSet = new Set();

  // 形式をXXXX-XXに変換する
  dates.forEach(({ trans_date }) => {

    // trans_dateがnullなら終了
    if (!trans_date) {
      return;
    }

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