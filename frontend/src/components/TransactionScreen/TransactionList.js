import React, { useState } from 'react';
import { useAuth } from '../../services/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios'; // HTTP req res
import styles from '../../styles/TransactionStatic/TransactionList.module.css'

const TransactionList = () => {

  const { user, isLoading } = useAuth(); // useAuthフックを使用して認証情報を取得
  const navigate = useNavigate(); // useNavigateフックを使用してページ遷移を管理

  // useState (Search用)
  const [yearDate, setYearDate] = useState(() => {
    const now = new Date();
    return now.getFullYear().toString();
  }); // 年検索
  const [monthDate, setMonthDate] = useState(''); // 月検索
  const [yearOptions, setYearOptions] = useState([]); // 年データ
  const [monthOptions, setMonthOptions] = useState([]); // 月データ
  const [groupedTransactions, setGroupedTransactions] = useState([]); // 集計済データ
  const [filteredTransactions, setFilteredTransactions] = useState([]); // 月検索フィルタ
  // 変換
  const majorItems = {
    income: '収支',
    expense: '支出'
  };
  // 変換
  const middleItems = {
    utility: '光熱費',
    salary: '給料',
    rent: '家賃',
    food: '食費',
    transportation: '交通費',
    beauty: '美容費',
    gasoline: 'ガソリン費',
    communication: '通信費',
    medicalCare: '医療費',
    insurance: '保険費',
    diningOut: '外食費',
    other: 'その他'
  };

  // 未ログイン時の遷移
  useEffect(() => {
    if (!user) {
      // ユーザーがログインしていない場合、ログインページにリダイレクト
      navigate('/home/login');
    }
  }, [user, isLoading, navigate]); // userとisLoadingが変化したときに実行される
  
  // 年月の一覧を取得する
  useEffect(() => {
    const fetchYearsAndMonths = async () => {
      try {
        const res = await axios.get('http://localhost:5001/transactions/list');
        setYearOptions(res.data.years); // [2023, 2024, 2025]
        setMonthOptions(res.data.months); // [1, 2, ..., 12]
      } catch (error) {
        console.error('年のデータの取得に失敗しました', error);
      }
    };
    fetchYearsAndMonths();
  }, []);
  
  // 集計データ取得
  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const res = await axios.get('http://localhost:5001/transactions/list/aggregate', {
          params: {
            year: Number(yearDate), // 年フィルタ
            userId: user._id
          }
        });

        const formatted = res.data.map(item => {
          const monthlyArray = Array(12).fill(0);
          item.monthly.forEach(mon => {
            monthlyArray[mon.month - 1] = mon.amount;
          });
          return {
            ...item,
            monthly: monthlyArray,
            total: monthlyArray.reduce((sum, val) => sum + val, 0)
          };
        });

        // 収支を一番トップにソートする
      const sorted = [...formatted]
      .sort((a, b) => {
        // major_sel = income を上に
        if (a.major_sel !== b.major_sel) {
          return a.major_sel === 'income' ? -1 : 1;
        }
        // 同じカテゴリなら middle_sel → minor_sel でソート
        if (a.middle_sel !== b.middle_sel) {
          return a.middle_sel.localeCompare(b.middle_sel);
        }
        return a.minor_sel.localeCompare(b.minor_sel);
      });

        setGroupedTransactions(sorted); // 全データ保存
        setFilteredTransactions(sorted); // 初期は全表示

      } catch (error) {
        console.error('集計データの取得に失敗しました', error);
      }
    };
    if (!user || !yearDate) return; // null または undefined除け
    fetchMonthlyData();
  }, [user, yearDate]);

  // 月変更時にfilteredTransactionsを更新
  useEffect(() => {
    const selectedMonth = Number(monthDate);
    if (!selectedMonth || selectedMonth < 1 || selectedMonth > 12) {
      setFilteredTransactions(groupedTransactions);
      return;
    }

    const filtered = groupedTransactions.map(item => {

      const amount = item.monthly[selectedMonth - 1] || 0;
      return {
        ...item,
        highlightMonthOnly: selectedMonth, // 表示だけ制御（金額は維持）
        total: amount
      };
    });

    setFilteredTransactions(filtered);
  }, [monthDate, groupedTransactions]);
  
  return (
    <main>
      <div className={styles.TransactionListMainContainer}>
        <div className={styles.TransactionListImg} />
          <h1>KAKEIBO LIST</h1>
          <div className={styles.List_row}>
            <label>年</label>
            <select value={yearDate} onChange={(e) => setYearDate(e.target.value)}>
              <option value="">-- 年を選択 --</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <label>月</label>
            <select value={monthDate} onChange={(e) => setMonthDate(e.target.value)}>
              <option value="">-- 月を選択 --</option>
              {monthOptions.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        
        <table className={styles.listTable}>
          <thead>
            <tr>
              <th rowSpan={3} colSpan={4}>合計・実績</th>
              <th rowSpan={2} colspan={12}>{yearDate}年</th>
              <th rowSpan={4} colSpan={2}>集計</th>
            </tr>
            <tr>
              <th hidden></th>
            </tr>
            <tr>
              <th rowSpan={1} colspan={12}>TableList</th>
            </tr>
            <tr>
              <th>大項目</th>
              <th>中項目</th>
              <th>小項目</th>
              <th>詳細</th>
              {[...Array(12)].map((_, i) => (
                <th key={i}>{i + 1}月</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((item, index) => {
              // 次が別の middle_sel か、末尾なら合計表示対象
              const isLastMiddle = index === filteredTransactions.length - 1 || filteredTransactions[index + 1]?.middle_sel !== item.middle_sel;

              return (
                <React.Fragment key={index}>
                  <tr className={styles.category_List}>
                    <td>{majorItems[item.major_sel] || item.major_sel}</td>
                    <td>{middleItems[item.middle_sel] || item.middle_sel}</td>
                    <td>{item.minor_sel}</td>
                    {/* memo.trim() !== '' でnullやundefined、''(空文字)を除外 */}
                    <td>
                      {Array.isArray(item.memos)
                      ? item.memos
                          .map(memo => String(memo).trim())        // 文字列化 + 前後の空白削除
                          .filter(memo => memo !== '')             // 空文字は除外
                          .join(', ')
                      : ''}
                    </td>
                    {item.monthly.map((amount, i) => (
                      <td key={i}>
                        {(() => {
                          const shouldShow = !item.highlightMonthOnly || i === item.highlightMonthOnly - 1;
                          return shouldShow && amount !== 0 ? amount : '';
                        })()}
                      </td>
                    ))}
                    <td colSpan={2}>{item.total}</td>
                  </tr>

                  {/* middle項目毎の合計行 */}
                  {isLastMiddle && (
                    <tr className={styles.category_rowColor}>
                      <td colSpan={4}>
                        {middleItems[item.middle_sel] || item.middle_sel} 合計
                      </td>
                      {[...Array(12)].map((_, i) => {
                        const middleTotal = filteredTransactions
                        .filter(tx => tx.middle_sel === item.middle_sel)
                        .reduce((sum, tx) => sum + (tx.monthly[i] || 0), 0);

                        return (
                          <td key={i}>
                            {(!monthDate || i === Number(monthDate) - 1) ? middleTotal.toLocaleString() : ''}
                          </td>
                        );
                      })}
                      {/* ← この2列分の合計を表示 */}
                      <td colSpan={2}>
                        {
                          filteredTransactions
                            .filter(tx => tx.middle_sel === item.middle_sel)
                            .reduce(
                              (totalSum, tx) => totalSum + tx.monthly.reduce((sum, val) => sum + val, 0),
                              0
                            )
                            .toLocaleString()
                        }
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}

            {/* 支出合計行（末尾）*/}
            {yearDate && (
            <>
              <tr className={styles.category_rowColor} style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                <td colSpan={4}>
                  {monthDate ? `支出  合計（${monthDate}月）` : '支出  合計'}
                </td>
                {[...Array(12)].map((_, i) => {
                  const total = filteredTransactions
                    .filter(item => item.major_sel === 'expense')
                    .reduce((sum, item) => sum + (item.monthly[i] || 0), 0);
                  return (
                    <td key={i}>
                      {(!monthDate || i === Number(monthDate) - 1)
                        ? total.toLocaleString()
                        : ''}
                    </td>
                  );
                })}
                <td colSpan={2}></td>
              </tr>
              {/* トータル合計（収支 + 支出） */}
              <tr className={styles.category_rowColor} style={{ fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>
                <td colSpan={4}>収支 + 支出 = 合計金額</td>
                {[...Array(12)].map((_, i) => {
                  const income = filteredTransactions
                    .filter(item => item.major_sel === 'income')
                    .reduce((sum, item) => sum + (item.monthly[i] || 0), 0);

                  const expense = filteredTransactions
                    .filter(item => item.major_sel === 'expense')
                    .reduce((sum, item) => sum + (item.monthly[i] || 0), 0);

                  const total = income + expense;

                  return (
                    <td key={i}>
                      {(!monthDate || i === Number(monthDate) - 1)
                        ? total.toLocaleString()
                        : ''}
                    </td>
                  );
                })}
                <td colSpan={2}></td>
              </tr>
            </>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default TransactionList; 