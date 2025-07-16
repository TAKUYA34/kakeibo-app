import React, { useState } from 'react';
import styles from '../../styles/TransactionStatic/TransactionAdd.module.css';
import { useAuth } from '../../services/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import PriceInput from '../../services/PriceInput.js' // 価格入力コンポーネントをインポート

const TransactionAdd = () => {

  const { user, isLoading } = useAuth(); // useAuthフックを使用して認証情報を取得
  const navigate = useNavigate(); // useNavigateフックを使用してページ遷移を管理

  useEffect(() => {
    if (!user) {
      // ユーザーがログインしていない場合、ログインページにリダイレクト
      navigate('/home/login');
    }
  }, [user, isLoading, navigate]); // userとisLoadingが変化したときに実行される


  // formの状態を管理するためのuseStateフックを使用
  const [majorSelect, setMajorSelect] = useState('default'); // 大項目
  const [middleSelect, setMiddleSelect] = useState('default'); // 中項目
  const [minorSelect, setMinorSelect] = useState(''); // 小項目
  const [price, setPrice] = useState(0); // 金額
  const [memo, setMemo] = useState(''); // メモ
  const [date, setDate] = useState(new Date()); // 現在の日付
  const [rows, setRows] = useState([]); // データ

  // errorの状態を管理するためのuseStateフックを使用
  const [majorError, setMajorError] = useState('');
  const [middleError, setMiddleError] = useState('');
  const [minorError, setMinorError] = useState('');
  const [priceError, setPriceError] = useState('');

  // 月別オブジェクト
  const [monthlyTotals, setMonthlyTotals] = useState({}); // key: '2025-07', value: 合計金額

  // 大項目データ
  const majorItems = {
    income: '収支',
    expense: '支出'
  };

  // 中項目データ
  const middleItems = {
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

  // 中項目データ ※収支を選択した場合のみ
  const salarySelect = {
    salary: '給料',
    bonus: 'ボーナス'
  }

  // 小項目データ
  const minorItems = {
    rent: ['住宅ローン'],
    utility: ['電気', 'ガス', '水道'],
    food: ['食料品', 'おやつ', '飲み会'],
    dailyNecessities: ['雑貨', '衣類', '家具'],
    education: ['塾', '習い事'],
    transportation: ['公共交通', 'タクシー', '通勤', '個人'],
    beauty: ['美容院', 'ネイル', '整形'],
    gasoline: ['通勤', '個人'],
    communication: ['携帯', 'WI-FI', 'データ購入'],
    medicalCare: ['精神科', '歯科', '内科', '整体', '消化器科', '皮膚科', '呼吸器内科', '健康診断', '薬'],
    insurance: ['生命保険', '医療保険', 'がん保険', '自動車保険', '火災保険'],
    entertainment: ['冠婚葬祭', 'レジャー施設', '交通費', '温泉']
  }

  // 日付変更
  const handleDateChange = (e) => {
    const selectedDate = e.target.value; // '2025-01-29'
    const [year, month, day] = selectedDate.split('-').map(Number);

    const [hour, minute] = [date.getHours(), date.getMinutes()];
    const newDate = new Date(year, month - 1, day, hour, minute); // Jaの時間に変更
    setDate(newDate);
  };

  // 時間変更 (hiddenで使用)
  const handleTimeChange = (e) => {
    const [hourStr, minuteStr] = e.target.value.split(':');
    const newDate = new Date(date);
    newDate.setHours(Number(hourStr), Number(minuteStr));
    setDate(newDate);
  };

  const handleMajorChange = (event) => {
    const value = event.target.value;
    setMajorSelect(value);

    if (value === 'income') {
      // 収入が選択された場合
      setMiddleSelect('salary'); // 中項目の初期値を設定
    } else {
      // 収支以外が選択された場合
      setMiddleSelect('');
    }
  };

  const handleMiddleChange = (event) => {
    setMiddleSelect(event.target.value);

    if (minorItems[event.target.value] && minorItems[event.target.value].length > 0) {
      // 中項目に小項目がある場合
      setMinorSelect('default'); // 小項目の初期値を設定
    } else {
      // 他の中項目が選択された場合
      setMinorSelect('');
    }
  };

  const handleMinorChange = (event) => {
    setMinorSelect(event.target.value);
  };

  const handleAddRow = () => {
    let hasError = false;

    if (!majorSelect || majorSelect === 'default') {
      setMajorError('大項目を選択してください');
      hasError = true;
    } else {
      setMajorError('');
    }

    if (!middleSelect || middleSelect === 'default') {
      setMiddleError('中項目を選択してください');
      hasError = true;
    } else {
      setMiddleError('');
    }

    if (minorItems.hasOwnProperty(middleSelect)) {
      if (!minorSelect || minorSelect === 'default') {
        setMinorError('小項目を選択してください')
        hasError = true;
      } else {
        setMinorError('');
      }
    } else {
      setMinorError('');
    }

    const numericPrice = parseInt(String(price).replace(/[^\d-]/g, ''), 10) || 0; // 数字以外の文字を除去し、整数に変換

    if (!numericPrice || isNaN(numericPrice)) {
      setPriceError('金額を入力してください');
      hasError = true;
    } else {
      setPriceError('');
    }
    
    if (hasError) {
      // エラーがある場合は追加しない
      return;
    }
    
    const signedPrice = majorSelect === 'expense' ? -Math.abs(numericPrice) : Math.abs(numericPrice); // 支出の場合はマイナス、収入の場合はプラスに変換
    
    const yearMonthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // 日付
    const currentMonthTotal = monthlyTotals[yearMonthKey] || 0;
    const updatedTotal = currentMonthTotal + signedPrice;

    setRows([
      ...rows,
      {
        date: date,
        major: majorSelect,
        middle: middleSelect,
        minor: minorSelect,
        price: `${numericPrice.toLocaleString()}円`, // 数字をカンマ区切りで表示
        priceNum: signedPrice, // 計算用
        initialTotal: `${updatedTotal.toLocaleString()}円`, // 合計金額をカンマ区切りで表示
        memo: memo
      }
    ]);

    // 月ごとの合計金額を更新
    setMonthlyTotals(prev => ({
      ...prev,
      [yearMonthKey]: updatedTotal
    }));

    // 入力フィールドをリセット
    setMajorSelect('default');
    setMiddleSelect('default');
    setMinorSelect('');
    setPrice(0);
    setMemo('');
    setMajorError('');
    setMiddleError(''); 
    setMinorError('');
    setPriceError('');
  };
  
  // Row Delete
  const handleDeleteRow = (indexToDelete) => {
    const deletedRow = rows[indexToDelete]; // 削除する行を取得

    const numericPrice = deletedRow.priceNum || 0; // 行の金額を取得
    const delDate = new Date(deletedRow.date); // 日付
    const yearMonthKey = `${delDate.getFullYear()}-${String(delDate.getMonth() + 1).padStart(2, '0')}`;
  
    setMonthlyTotals(prev => ({
      ...prev,
      [yearMonthKey]: (prev[yearMonthKey] || 0) - numericPrice
    }));

    // 指定されたインデックスの行を削除
    setRows(prevRows => prevRows.filter((_, idx) => idx !== indexToDelete));
  };

  const handleRegister = async () => {

    if (rows.length === 0) {
      alert('登録するデータがありません。');
      return;
    }

    const payload = {
      userId: user ? user._id : null, // ユーザーIDを取得
      transactions: rows.map(row => ({
        ...row,
        trans_date: row.date instanceof Date ? row.date.toISOString() : new Date(row.date).toISOString(), // Modelと合わせないとエラーになる
        amount: row.priceNum
      }))
    };

    try {
      const response = await fetch('http://localhost:5001/api/transactions/add/register', { // APIエンドポイントを適切に設定
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // 認証管理
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error('サーバーエラーが発生しました。' + errorText);
      }
      
      alert('テーブルの登録が完了しました。');
      setRows([]); // 登録後にテーブルをクリア
    } catch (error) {
      alert('テーブルの登録に失敗しました。');
    }
  };

  return (
    <main>
      <div className={styles.transactionAddMainContainer}>
        <div className={styles.transactionAddImage} />
          <div className={styles.header_row}>
            <h1>Register your household account book</h1>
            <hr />
          </div>

        <div className={styles.category_Container}>
          <div className={styles.category_row}>
            <h1>Category</h1>
            <label>大項目：</label>
            <select value={majorSelect} onChange={handleMajorChange} name='majorSelect'>
              <option value='default'>-- 大項目 --</option>
              {Object.entries(majorItems).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {majorError && <div style={{ color: 'red', textAlign: 'center', marginTop: '8px' }}>{majorError}</div>}
          </div>

          <div className={styles.date_row}>
            <label>日付：</label>
            <input
              type="date"
              value={`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`}
              onChange={handleDateChange}
            />

            <input
              type="time"
              value={date.toTimeString().slice(0, 5)}
              onChange={handleTimeChange}
              hidden
            />
          </div>
        </div>
        <hr />

        <div className={styles.items_row}>
          <div className={styles.items_Container}>
            <h1>Items</h1>
            <div className={styles.select_row}>
              <label className={styles.label_middle}>中項目：</label>
              <select value={middleSelect} onChange={handleMiddleChange} name='middleSelect'>
                <option value='default'>-- 中項目 --</option>
                { majorSelect === 'income' ? (
                  <>
                    { Object.entries(salarySelect).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </>
                ) : (
                  <>
                    { Object.entries(middleItems).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </>
                )};
              </select>
              {middleError && (
                <div style={{ color: 'red', textAlign: 'center', marginTop: '8px' }}>{middleError}</div>
              )}
            </div>
            
            <div className={styles.select_row}>
              { /* 中項目の選択に応じて小項目を表示 */ }
              { majorSelect === 'income' ? (
                <></> 
                ) : (
                <>
                  <label className={styles.label_minor}>小項目：</label>
                  <select value={minorSelect} onChange={handleMinorChange} name='minorSelect'>
                    <option value='default'>-- 小項目 --</option>
                    { minorItems[middleSelect] && minorItems[middleSelect].length > 0 ? (
                      minorItems[middleSelect].map((item, index) => (
                        <option key={index} value={item}>{item}</option>
                      ))
                      /* 中項目の選択に応じて小項目を表示 */
                      ) : (
                      <option value='default'>選択可能な小項目がありません</option>
                    )}
                  </select>
                  {minorError && <div style={{ color: 'red', textAlign: 'center', marginTop: '8px' }}>{minorError}</div>}
                </>
              )}
            </div>

            <div className={styles.select_row2}>
              <PriceInput value={price} onChange={setPrice} className={styles.label_amount} error={priceError}/> {/* 価格入力コンポーネントを追加 */}
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <label htmlFor='memo' className={styles.label_memo}>詳細</label>
                <textarea name="memo" value={memo} onChange={(e) => setMemo(e.target.value)} placeholder='詳細' rows={4} cols={40} />
              </div>
            </div>
          </div>
        </div>
        <hr />

        <div className={styles.table_row}>
          <h1>Table</h1>
          <button onClick={handleAddRow} className={styles.addButton}>
            <span>追加する</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
              <path stroke="currentColor" strokeWidth="0.8" d="m5.791 3.5 3.709 3H2"></path>
            </svg>
          </button>

          <table className={styles.transactionTable}>
            <thead>
              <tr>
                <th>追加日</th>
                <th>大項目</th>
                <th>中項目</th>
                <th>小項目</th>
                <th>金額</th>
                <th>合計</th>
                <th>詳細</th>
                <th>削除</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>{new Date(row.date).toLocaleString()}</td>
                  <td>{majorItems[row.major] || row.major}</td>
                  <td>
                    {majorItems[row.major] === '収支' ? salarySelect[row.middle] || row.middle : middleItems[row.middle] || row.middle}
                  </td>
                  <td>{row.minor}</td>
                  <td>{row.price}</td>
                  <td>{row.initialTotal}</td>
                  <td>{row.memo}</td>
                  <td>
                    <button type="button" name="delete" className={styles.deleteBtn} onClick={() => handleDeleteRow(index)}>
                      <span>削除する</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
                        <path stroke="currentColor" strokeWidth="0.8" d="m5.791 3.5 3.709 3H2"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr />
        </div>

        <div className={styles.register_row}>
          <h1>Register</h1>
          <button type='button' onClick={handleRegister} className={styles.registerBtn}>
            <span>登録する</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
              <path stroke="currentColor" strokeWidth="0.8" d="m5.791 3.5 3.709 3H2"></path>
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
};

export default TransactionAdd;