import styles from '../../styles/MenuStatic/ExportPdfAndCsv.module.css';
import { useState, useEffect } from 'react';
import { useAuth } from '../../services/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ExportPdfAndCsv = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [yearOptions, setYearOptions] = useState([]);
  const [monthOptions, setMonthOptions] = useState([]);
  const [yearMonthMap, setYearMonthMap] = useState({});

  const [yearDate, setYearDate] = useState('');
  const [monthDate, setMonthDate] = useState('');
  const [format, setFormat] = useState('csv');

  useEffect(() => {
    if (!user) {
      // ユーザーがログインしていない場合、ログインページにリダイレクト
      navigate('/home/login');
    }
  }, [user, isLoading, navigate]); // userとisLoadingが変化したときに実行される

// 年月オプションの取得
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5001/api/transactions/date-options', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const data = res.data; // axiosはレスポンスデータを `.data` に持っているため、.jsonはだめ
      const map = {};
      data.forEach(({ year, month }) => {
        if (!map[year]) map[year] = new Set();
        map[year].add(month);
      });

      const convertedMap = {};
      for (const y in map) {
        convertedMap[y] = Array.from(map[y]).sort((a, b) => a - b);
      }

      setYearMonthMap(convertedMap);
      setYearOptions(Object.keys(convertedMap).sort((a, b) => b - a));
    })
    .catch(err => console.error('年月取得エラー:', err));
  }, []);

  // 年を選んだら月をリセット
  useEffect(() => {
    if (yearDate && yearMonthMap[yearDate]) {
      setMonthOptions(yearMonthMap[yearDate]);
    } else {
      setMonthOptions([]);
      setMonthDate(''); // 選ばれた月もリセット
    }
  }, [yearDate, yearMonthMap]);

  // ダウンロード処理
  const handleDownload = async () => {
    if (!yearDate || !format) {
      alert('年と形式は必須です');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('ログインが必要です');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/transactions/export', {
        params: { year: yearDate, month: monthDate, format },
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` }
      });

      const paddedMonth = monthDate ? String(monthDate).padStart(2, '0') : '';
      const fileName = `summary_${yearDate}${paddedMonth ? `_${paddedMonth}` : ''}.${format}`;
      const blob = new Blob([response.data], { type: format === 'csv' ? 'text/csv' : 'application/pdf' });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('ダウンロードに失敗しました', err.response?.data?.error);
      alert('ダウンロードに失敗しました');
    }
  };

  return (
    <main>
      <>
        <div className={styles.exportMainContainer}>
          <div className={styles.exportPdfAndCsvImage} />
          <h1>Data Export</h1>

          <div className={styles.select_row}>
            <label>年：</label>
            <select value={yearDate} onChange={(e) => setYearDate(e.target.value)}>
              <option value="">-- 年を選択 --</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <label>月：</label>
            <select value={monthDate} onChange={(e) => setMonthDate(e.target.value)}>
              <option value="">-- 月を選択 --</option>
              {monthOptions.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>

            <label>ファイル形式：</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value='csv'>CSV</option>
              <option value='pdf'>PDF</option>
            </select>
          </div>

          <div className={styles.btn_row}>
            <button type="button" onClick={handleDownload} className={styles.download_btn}>
            <span>ダウンロード</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
              <path stroke="currentColor" strokeWidth="0.8" d="m5.791 3.5 3.709 3H2"></path>
            </svg>
            </button>
          </div>
        </div>
      </>
    </main>
  );
};

export default ExportPdfAndCsv;