import React, { useState } from 'react';
import styles from '../../styles/TransactionStatic/TransactionAdd.module.css';
import { useAuth } from '../../services/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useRef } from 'react';
import PriceInput from '../../services/PriceInput.js'; // 価格入力コンポーネントをインポート

const TransactionAdd = () => {

  const { user, isLoading } = useAuth(); // useAuthフックを使用して認証情報を取得
  const navigate = useNavigate(); // useNavigateフックを使用してページ遷移を管理

  /* 未ログイン時はログイン画面にリダイレクト */
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
  // const [minorError, setMinorError] = useState('');
  const [priceError, setPriceError] = useState('');

  // 月別オブジェクト
  const [monthlyTotals, setMonthlyTotals] = useState({}); // key: '2025-07', value: 合計金額

  // 履歴機能を追加
  const [favorites, setFavorites] = useState([]);

  // 編集中フラグ
  const [isEditing, setIsEditing] = useState(false);

  // 編集用
  const [editIndex, setEditIndex] = useState(null); // 編集中の行のインデックス
  const [formData, setFormData] = useState({
    major: '',
    middle: '',
    minor: '',
    price: '',
    priceNum: '',
    memo: ''
  });

  // メモにフォーカスを当てるための定数
  const memoInputRef = useRef(null);

  // 編集ボタンを押したら大項目にフォーカスを当てる
  const middleInputRef = useRef(null);

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

  /* 編集モード時は大項目フィルタON */
  useEffect(() => {
    // 編集中は初期化しない
    if (!isEditing) {
      // 支出・収入の選択が変わったら中項目を初期化
      setMiddleSelect('default');
      setFormData(prev => ({ ...prev, middle: '' }));
    }
  }, [majorSelect]);

  /* 日付変更 */
  const handleDateChange = (e) => {
    const selectedDate = e.target.value; // '2025-01-29'
    const [year, month, day] = selectedDate.split('-').map(Number);

    const [hour, minute] = [date.getHours(), date.getMinutes()];
    const newDate = new Date(year, month - 1, day, hour, minute); // Jaの時間に変更
    setDate(newDate);
  };

  /* 時間変更 (hiddenで使用) */
  const handleTimeChange = (e) => {
    const [hourStr, minuteStr] = e.target.value.split(':');
    const newDate = new Date(date);
    newDate.setHours(Number(hourStr), Number(minuteStr));
    setDate(newDate);
  };

  /* major Select */
  const handleMajorChange = (event) => {
    const value = event.target.value;
    setMajorSelect(value);

    setFormData(prev => ({...prev, major: value}));

    if (value === 'income') {
      // 収入が選択された場合
      setMiddleSelect('salary'); // 中項目の初期値を設定
    } else {
      // 収支以外が選択された場合
      setMiddleSelect('');
    }
  };

  /* middle Select */
  const handleMiddleChange = (event) => {

    const selected = event.target.value;
    setMiddleSelect(selected);

    // 変更時にsetDataをCall
    setFormData(prev => ({...prev, middle: selected}));
  };

  /* minor Select */
  const handleMinorChange = (event) => {
    const value = event.target.value;
    setMinorSelect(value);

    setFormData(prev => ({...prev, minor: value}));
  };
  
  /* 追加ボタン押下時 */
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

    // if (minorItems.hasOwnProperty(middleSelect)) {
    //   if (!minorSelect || minorSelect === 'default') {
    //     setMinorError('小項目を選択してください')
    //     hasError = true;
    //   } else {
    //     setMinorError('');
    //   }
    // } else {
    //   setMinorError('');
    // }

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

    // formのデータをTableに渡す
    setRows([
      ...rows,
      {
        date: date,
        major: majorSelect,
        middle: middleSelect,
        minor: minorSelect,
        price: `${signedPrice.toLocaleString()}円`, // 数字をカンマ区切りで表示
        priceNum: signedPrice, // 計算用
        total_amount: `${updatedTotal.toLocaleString()}円`, // 合計金額をカンマ区切りで表示
        memo: memo
      }
    ]);

    /* お気に入り登録 */
    setFavorites(prev => {
      // console.log(formData);
      const newEntry = { major: formData.major, middle: formData.middle, price: formData.priceNum };
      const updated = [newEntry, ...prev.filter(item => !(item.major === newEntry.major && item.middle === newEntry.middle && item.price === newEntry.price))];
      return updated.slice(0, 3); // 最大3つ表示
    });

    /* 月ごとの合計金額を更新 */
    setMonthlyTotals(prev => ({
      ...prev,
      [yearMonthKey]: updatedTotal
    }));
    console.log(minorSelect);

    // 入力フィールドをリセット
    setMajorSelect('default');
    setMiddleSelect('default');
    setMinorSelect('');
    setPrice('');
    setMajorError('');
    setMiddleError('');
    // setMinorError('');
    setPriceError('');

  };

  /* お気に入りボタン押下でフォームにセット */
  const handleFavoriteClick = (major, middle, price) => {

    setIsEditing(true);

    setMajorSelect(major);
    setMiddleSelect(middle);
    setPrice(String(price));
    setFormData(prev => ({
      ...prev,
      major: major,
      middle: middle,
      priceNum: price
    }));

    // 次の入力欄にフォーカスを移動したい場合はここで処理
    memoInputRef.current?.focus();
  };

  /* 編集ボタン押下時 */
  const handleEditClick = (index) => {
    // 編集フラグON
    setIsEditing(true);

    const tx = rows[index];

    setFormData({
      major: tx.major,
      middle: tx.middle,
      minor: tx.minor,
      priceNum: String(tx.priceNum),
      memo: tx.memo || '',
    });

    setMajorSelect(tx.major);
    setMiddleSelect(tx.middle);
    setMinorSelect(tx.minor);
    setMemo(tx.memo || '');
    setPrice(String(tx.priceNum));

    setEditIndex(index); // 編集モードを有効にする

    middleInputRef.current?.focus();
  };

  /* Cancelボタン押下時 */
  const handleCancelEdit = () => {
    setIsEditing(false); // 編集フラグ OFF
    setEditIndex(null);
    setFormData({
      major: '',
      middle: '',
      minor: '',
      priceNum: '',
      memo: '',
    });
    setMajorSelect('default');
    setMiddleSelect('default');
    setMinorSelect('');
    setMemo('');
    setPrice('');
  };

  /* Saveボタン押下時 */
  const handleSaveEdit = () => {
    const newRows = [...rows];
    const oldRow = newRows[editIndex];

    const updatedPriceNum = Number(formData.priceNum);
    const updatedPrice = `${updatedPriceNum.toLocaleString()}円`;

    // 行の更新
    newRows[editIndex] = {
      ...oldRow, // date, total_amount などを維持
      middle: formData.middle,
      minor: formData.minor,
      price: updatedPrice,
      priceNum: updatedPriceNum,
      memo: formData.memo,
    };

    // 合計金額の更新
    const updatedTotal = newRows.reduce((acc, row) => acc + row.priceNum, 0);
    newRows[editIndex].total_amount = `${updatedTotal.toLocaleString()}円`;

    // 状態を更新
    setRows(newRows);
    console.log(newRows);
    setEditIndex(null);
    setFormData({
      major: '',
      middle: '',
      minor: '',
      priceNum: '',
      memo: '',
    });
    setMajorSelect('');
    setMiddleSelect('');
    setMinorSelect('');
    setMemo('');
    setPrice('');
  };

  /* 削除ボタン押下時 */
  const handleDeleteRow = (indexToDelete) => {
    const deletedRow = rows[indexToDelete]; // 削除する行を取得

    const numericPrice = deletedRow.priceNum || 0; // 行の金額を取得
    const delDate = new Date(deletedRow.date); // 日付
    const yearMonthKey = `${delDate.getFullYear()}-${String(delDate.getMonth() + 1).padStart(2, '0')}`;

    const deleteAlertMessage = window.confirm('データを削除しますか？')
    
    // OKボタン押下したら削除する
    if (deleteAlertMessage) {
      setMonthlyTotals(prev => ({
        ...prev,
        [yearMonthKey]: (prev[yearMonthKey] || 0) - numericPrice
      }));

      // 指定されたインデックスの行を削除
      setRows(prevRows => prevRows.filter((_, idx) => idx !== indexToDelete));
    }
  };

  /* 登録するボタン押下時 */
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
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/transactions/add/register', { // APIエンドポイントを適切に設定
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error('サーバーエラーが発生しました。' + errorText);
      }
      
      alert(`${rows.length}件のデータ登録が完了しました。`);
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
            <select value={majorSelect} onChange={handleMajorChange} name='majorSelect' disabled={editIndex !== null}>
              <option value='default'>-- 大項目 --</option>
              {Object.entries(majorItems).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {majorError && <div style={{ color: 'red', textAlign: 'center' }}>{majorError}</div>}
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
        {/* 編集中メッセージ表示 */}
        {isEditing && (
          <div className={styles.editingMessage}>
            <p>編集中...</p>
          </div>
        )}
        <div className={styles.items_row}>
          <div className={styles.items_Container}>
            <h1>Items</h1>
            {/* お気に入り表示 */}
            {favorites.length > 0 && (
              <div className={styles.favoritesContainer}>
                <h2>お気に入りテンプレート</h2>
                <div className={styles.favoritesList}>
                  {favorites.map(({ major, middle, price }, i) => (
                    <button
                      key={i}
                      type="button"
                      className={styles.favoriteBtn}
                      onClick={() => handleFavoriteClick(major, middle, price)}
                    >
                      <span className={styles.favoriteIcon}>★</span>
                      <span className={styles.favoriteLabel}>お気に入り{i + 1}</span>
                      <span className={styles.favoriteText}>
                        {middle} - {price.toLocaleString()}円
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.select_row}>
              <label className={styles.label_middle}>中項目：</label>
              <select value={middleSelect} onChange={handleMiddleChange} name='middleSelect' className={middleError ? styles.errorInput : ''}  ref={middleInputRef}>
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
                    <option value=''>-- 小項目 --</option>
                    { minorItems[middleSelect] && minorItems[middleSelect].length > 0 ? (
                      minorItems[middleSelect].map((item, index) => (
                        <option key={index} value={item}>{item}</option>
                      ))
                      /* 中項目の選択に応じて小項目を表示 */
                      ) : (
                      <option value=''>選択可能な小項目がありません</option>
                    )}
                  </select>
                  {/*minorError && <div style={{ color: 'red', textAlign: 'center', marginTop: '8px' }}>{minorError}</div>*/}
                </>
              )}
            </div>

            <div className={styles.select_row2}>
              <PriceInput value={price}
                onChange={(value) => {
                  setPrice(value);
                  setFormData(prev => ({ ...prev, priceNum: value }));
                }}
                className={styles.label_amount} error={priceError}/> {/* 価格入力コンポーネントを追加 */}
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <label htmlFor='memo' className={styles.label_memo}>詳細</label>
                <textarea name="memo"
                  ref={memoInputRef}
                  value={memo}
                  onChange={(e) => {
                    setMemo(e.target.value);
                    setFormData(prev => ({ ...prev, memo: e.target.value }))
                    }}
                    placeholder='詳細' rows={4} cols={40} />
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
                <th>編集</th>
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
                  <td>{row.total_amount}</td>
                  <td>{row.memo}</td>
                  <td>
                    {editIndex === index ? (
                      <>
                      <div className={styles.editCreateTable}>
                        <button onClick={handleSaveEdit} className={styles.editCreate_btn}>
                          <span>保存する</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
                            <path stroke="currentColor" strokeWidth="0.8" d="m5.791 3.5 3.709 3H2"></path>
                          </svg>
                        </button>
                        <button onClick={handleCancelEdit} className={styles.editCancel_btn}>
                          <span>キャンセル</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
                            <path stroke="currentColor" strokeWidth="0.8" d="m5.791 3.5 3.709 3H2"></path>
                          </svg>
                        </button>
                      </div>
                      </>
                    ) : (
                      <button onClick={() => handleEditClick(index)} className={styles.editBtn}>
                        <span>編集する</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
                          <path stroke="currentColor" strokeWidth="0.8" d="m5.791 3.5 3.709 3H2"></path>
                        </svg>
                      </button>
                    )}
                  </td>
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