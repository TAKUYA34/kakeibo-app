// 和暦→西暦変換
function convertWarekiToSeireki(era, year) {
  if (era === 'R') return 2018 + year; // 令和
  if (era === 'H') return 1988 + year; // 平成（例: H1=1989）
  if (era === 'S') return 1925 + year; // 昭和（例: S1=1926）
  return null;
}

// 和暦日付（例: "R7年1月7日"）→ Date型へ変換
function convertWarekiToDate(warekiStr) {
  console.log("warekiStr:", warekiStr); // undefined になっていないか確認
  const match = warekiStr.match(/^([RHS])(\d+)年(\d+)月(\d+)日$/);
  if (!match) return null;

  const [, era, y, m, d] = match;
  const year = convertWarekiToSeireki(era, parseInt(y, 10));
  return new Date(year, parseInt(m, 10) - 1, parseInt(d, 10));
}

module.exports = {
  convertWarekiToDate
};