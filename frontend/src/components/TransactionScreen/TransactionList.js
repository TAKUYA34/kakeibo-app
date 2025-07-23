import React, { useState } from 'react';
import { useAuth } from '../../services/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useMemo } from 'react';
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
  const [searchTerm, setSearchTerm] = useState(''); // 検索ワード
  
  // 変換
  const majorItems = {
    income: '収支',
    expense: '支出'
  };
  // 変換
  const middleItems = {
    salary: '給料',
    bonus: 'ボーナス',
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
        const token = localStorage.getItem('token');

        const res = await axios.get('http://localhost:5001/api/transactions/list', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

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
        const token = localStorage.getItem('token');

        const res = await axios.get('http://localhost:5001/api/transactions/list/aggregate', {
          headers: {
            Authorization: `Bearer ${token}`
          },
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
      const sorted = [...formatted].sort((a, b) => {
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
      
      } catch (error) {
        console.error('集計データの取得に失敗しました', error);
      }
    };
    if (!user || !yearDate) return; // null または undefined除け
    fetchMonthlyData();
  }, [user, yearDate]);

  // useMemo で filteredTransactions を計算
  const filteredTransactions = useMemo(() => {
    const selectedMonth = Number(monthDate);
    const keyword = searchTerm.trim().toLowerCase(); //スペースやタブを排除

    return groupedTransactions
      // データ探索
      .map(item => {
        const amount = selectedMonth
          ? item.monthly[selectedMonth - 1] || 0
          : item.total;

        return {
          ...item,
          highlightMonthOnly: selectedMonth,
          total: amount
        };
      })
      // 検索対象カスタマイズ
      .filter(item => {
        if (!keyword) return true; // 検索フォームが空なら除外
        if (item.major_sel === 'income') return true; // 収支は検索対象から除外

        // メモ検索
        const inMemos = Array.isArray(item.memos) && 
          item.memos.some(memo =>
          String(memo).toLowerCase().includes(keyword) // DBから正常にデータを取得 && 検索ワードに該当すれば大文字小文字関係なくtrueになる
        );

         // 英語から日本語に変換
        const middleJapanese = middleItems[item.middle_sel] || '';

        const inMiddle = middleJapanese.includes(keyword);
        const inMinor = item.minor_sel?.toLowerCase().includes(keyword);

        return inMemos || inMiddle || inMinor;

      });
  }, [groupedTransactions, monthDate, searchTerm]);

  return (
    <main>
      <div className={styles.TransactionListMainContainer}>
        <div className={styles.TransactionListImg} />
          <h1>KAKEIBO LIST</h1>
          <div className={styles.List_row}>
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
          
            {/* 検索入力欄 */}
            <label htmlFor="search">検索：</label>
            <input
              type="text"
              id="search" // ← labelと対応
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="search"
            />
          </div>
        
        <div className={styles.listTableContainer}>
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
                            .map(memo => String(memo).trim())
                            .filter(memo => memo !== '')
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
                            <td key={i} className={styles.total_row}>
                              {(!monthDate || i === Number(monthDate) - 1) ? middleTotal.toLocaleString() : ''}
                            </td>
                          );
                        })}
                        {/* ← この2列分の合計を表示 */}
                        <td colSpan={2} className={styles.total_row}>
                          {
                            (() => {
                              // 月検索した時の集計金額
                              if (monthDate) {
                                const i = Number(monthDate) - 1;
                                const monthlySum = filteredTransactions
                                  .filter(tx => tx.middle_sel === item.middle_sel)
                                  .reduce((sum, tx) => sum + (tx.monthly[i] || 0), 0);
                                return monthlySum.toLocaleString();
                              } else {
                                // 全体の集計金額（12ヶ月分合計）
                                return filteredTransactions
                                  .filter(tx => tx.middle_sel === item.middle_sel)
                                  .reduce(
                                    (totalSum, tx) => totalSum + tx.monthly.reduce((sum, val) => sum + val, 0),
                                    0
                                  )
                                  .toLocaleString();
                              }
                            })()
                          }
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

              {/* 支出合計行（末尾） */}
              {yearDate && (
              <>
                <tr className={styles.category_rowColor} style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                  <td colSpan={4}>
                    {monthDate ? `支出 合計（${monthDate}月）` : '支出 合計'}
                  </td>
                  {[...Array(12)].map((_, i) => {
                    const total = filteredTransactions
                      .filter(item => item.major_sel === 'expense')
                      .reduce((sum, item) => sum + (item.monthly[i] || 0), 0);

                    return (
                      <td key={i} className={styles.total_row}>
                        {(!monthDate || i === Number(monthDate) - 1)
                          ? total.toLocaleString()
                          : ''}
                      </td>
                    );
                  })}
                  <td colSpan={2} className={styles.total_row}>
                    {
                      (() => {
                        if (monthDate) {
                          const i = Number(monthDate) - 1;
                          return filteredTransactions
                            .filter(item => item.major_sel === 'expense')
                            .reduce((sum, item) => sum + (item.monthly[i] || 0), 0)
                            .toLocaleString();
                        } else {
                          return filteredTransactions
                            .filter(item => item.major_sel === 'expense')
                            .reduce((totalSum, item) =>
                              totalSum + item.monthly.reduce((sum, val) => sum + val, 0), 0
                            )
                            .toLocaleString();
                        }
                      })()
                    }
                  </td>
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
                      <td key={i} className={styles.total_row}>
                        {(!monthDate || i === Number(monthDate) - 1)
                          ? total.toLocaleString()
                          : ''}
                      </td>
                    );
                  })}
                  <td colSpan={2} className={styles.total_row}>
                    {
                      (() => {
                        if (monthDate) {
                          const i = Number(monthDate) - 1;
                          const total = filteredTransactions.reduce((sum, item) => sum + (item.monthly[i] || 0), 0);
                          return total.toLocaleString();
                        } else {
                          const total = filteredTransactions.reduce(
                            (sum, item) => sum + item.monthly.reduce((acc, val) => acc + val, 0), 0
                          );
                          return total.toLocaleString();
                        }
                      })()
                    }
                  </td>
                </tr>
              </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default TransactionList; 