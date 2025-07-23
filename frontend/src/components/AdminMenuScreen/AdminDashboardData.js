import { useState, useEffect } from "react";
import axios from 'axios';
import { useAdminAuth } from '../../services/AdminAuthContext';
import AdminDashboardEditModal from '../../modalComponents/AdminDashboardEditModal'; // 編集用画面
import styles from "../../styles/AdminMenuStatic/AdminDashboardData.module.css";

const AdminDashboardData = () => {

  // useState
  const { adminUser } = useAdminAuth(); // ログイン認証
  const [transactions, setTransactions] = useState([]); // 全取引一覧データを格納する箱
  const [isLoading, setIsLoading] = useState(true); // ログインフラグ

  // ユーザーとカテゴリ検索用
  const [userKeyword, setUserKeyword] = useState([]); // ユーザー名
  const [categoryMajorKeyword, setCategoryMajorKeyword] = useState([]) // カテゴリ(大項目)
  const [categoryMiddleKeyword, setCategoryMiddleKeyword] = useState([]) // カテゴリ(中項目)
  const [categoryMinorKeyword, setCategoryMinorKeyword] = useState([]) // カテゴリ(小項目)
  const [transDateKeyword, setTransDateKeyword] = useState([]); // 日付
  const [memoKeyword, setMemoKeyword] = useState([]); // メモ名
  
  // 編集用画面
  const [isModalOpen, setIsModalOpen] = useState(false); // 初期はfalse
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // token取得
  const adminToken = localStorage.getItem("admin_token");

  // en → jaに変更（Table表示用）
  const majorItemsENToJA = {
    income: '収支',
    expense: '支出'
  };

  // en → jaに変更（Table表示用）
  const middleItemsENToJA = {
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

  // ja → enに変換（検索用）
  const majorItemsJAToEN = {
    '収支': 'income',
    '支出': 'expense'
  };
  // ja → enに変換（検索用）
  const middleItemsJAToEN = {
    '給料': 'salary',
    'ボーナス': 'bonus',
    '光熱費': 'utility',
    '家賃': 'rent',
    '食費': 'food',
    '日用品費': 'dailyNecessities',
    '教育費': 'education',
    '交通費': 'transportation',
    '美容費': 'beauty',
    'ガソリン費': 'gasoline',
    '通信費': 'communication',
    '医療費': 'medicalCare',
    '保険費': 'insurance',
    '外食費': 'diningOut',
    '娯楽費': 'entertainment',
    '趣味費': 'hobby',
    '特別費': 'special',
    'その他': 'other'
  };

  useEffect(() => {
    // 未ログイン時は処理しない
    if (!adminUser) {
      setIsLoading(false);
      return;
    }
  
    /* 全取引一覧 */
    const fetchAllTransactions = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/admin/home/dashboard', {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        });
        setTransactions(res.data);
      } catch (err) {
        console.error('全取引取得エラー', err);
      }
    };
    fetchAllTransactions(); // 初期ロード
  }, [adminUser, adminToken]);


  /* ユーザ名、カテゴリ名、メモ名で検索 */
  const handleSearch = async () => {
    try {

      // en → jaに変更
      const majorCategoryTranslated = majorItemsJAToEN[categoryMajorKeyword] || categoryMajorKeyword;
      const middleCategoryTranslated = middleItemsJAToEN[categoryMiddleKeyword] || categoryMiddleKeyword;

      const res = await axios.post('http://localhost:5001/api/admin/home/dashboard/search',
        {
          name: userKeyword?.trim() || null,
          category_major: majorCategoryTranslated,
          category_middle: middleCategoryTranslated,
          category_minor: categoryMinorKeyword,
          trans_date: transDateKeyword,
          memo: typeof memoKeyword === 'string' && memoKeyword.trim() !== '' ?
            memoKeyword.trim() : ''
        },
        {
          headers: {Authorization: `Bearer ${adminToken}` }
        }
      );
      setTransactions(res.data);
    } catch (err) {
      console.error('検索に失敗しました', err);
    }
  };

  /* 編集ボタン押下時 */
  const handleSaveTransaction = async (updatedTx) => {
    try {

      // user_id が populate されていたら _id に変換
      const normalizedTx = {
        ...updatedTx,
        user_id: updatedTx.user_id?._id || updatedTx.user_id,
      };

      const res = await axios.put(`http://localhost:5001/api/admin/home/dashboard/edit/${updatedTx._id}`, normalizedTx, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      console.log('res.data全体', res.data);
      
      let updatedAll = res.data.updatedData;
      
      console.log('受け取り側', updatedAll )

      // ここで全体のデータを更新する
      setTransactions(prev => 
        prev.map(tx => {
          const match = updatedAll.find(u => u._id === tx._id);
          return match || tx; // 一致したら置き換え 一致しなければそのまま
        })
      );

      // console.log('更新後のデータ', updated);
    } catch (err) {
      console.error('更新に失敗しました', err);
    }
  };

  /* 削除ボタン押下時 */
  const handleDeleteTransaction = async (transactionId, userName) => {
    const confirmDelete = window.confirm(`${userName}さんの取引データを削除しますか？`);

    try {
      if (confirmDelete) {
        const res = await axios.delete(`http://localhost:5001/api/admin/home/dashboard/delete/${transactionId}`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });

        // サーバーから削除後、最新の取引を受け取る
        const deletedUpdateTransactions = res.data.deletedUpdateTransactionTx;

        // 状態を更新
        setTransactions(deletedUpdateTransactions);

        console.log('削除後の最新取引データ:', deletedUpdateTransactions);
      }
    } catch (err) {
      console.error('削除に失敗しました', err);
    }
  };

  return (    
    <main>
      <div className={styles.AdminDashboardDataContainer}>
        <div className={styles.AdminDashboardDataImage} />
        <h1>Admin Dashboard</h1>

        <div className={styles.searchContainer}>
          <h2 className={styles.searchTitle}>検索フィルター</h2>
          <div className={styles.search_row}>
            <label>
              ユーザー検索
              <span>必須</span>
              </label>
            <input
              type="text"
              value={userKeyword}
              onChange={(e) => setUserKeyword(e.target.value)}
              placeholder="ユーザー名で検索">
            </input>
          </div>

          <div className={styles.search_row}>
            <label>
              カテゴリ検索（大項目）
              <span>任意</span>
            </label>
            <input
              type="text"
              value={categoryMajorKeyword}
              onChange={(e) => setCategoryMajorKeyword(e.target.value)}
              placeholder="例: 収支／支出"
            />
          </div>

          <div className={styles.search_row}>
            <label>
              カテゴリ検索（中項目）
              <span>任意</span>
            </label>
            <input
              type="text"
              value={categoryMiddleKeyword}
              onChange={(e) => setCategoryMiddleKeyword(e.target.value)}
              placeholder="例: 光熱費"
            />
          </div>

          <div className={styles.search_row}>
            <label>
              カテゴリ検索（小項目）
              <span>任意</span>
            </label>
            <input
              type="text"
              value={categoryMinorKeyword}
              onChange={(e) => setCategoryMinorKeyword(e.target.value)}
              placeholder="例: 電気"
            />
          </div>

          <div className={styles.search_row}>
            <label>
              月検索
              <span>任意</span>
            </label>
            <input
              type="text"
              value={transDateKeyword}
              onChange={(e) => setTransDateKeyword(e.target.value)}
              placeholder="例: 07"
            />
          </div>

          <div className={styles.search_row}>
            <label>
              メモ検索
              <span>任意</span>
            </label>
            <input
              type="text"
              value={memoKeyword}
              onChange={(e) => setMemoKeyword(e.target.value)}
              placeholder="メモ名で検索">
            </input>
          </div>

          <div className={styles.searchBtn_row}>
            <button onClick={handleSearch} className={styles.search_btn}>
              <span>検索する</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
                  <path stroke="currentColor" strokeWidth="0.8" d="m5.791 3.5 3.709 3H2"></path>
                </svg>
            </button>
          </div>
        </div>

        <div className={styles.table_row}>
          <table className={styles.tableContainer}>
            <thead>
              <tr>
                <th>ユーザー名</th>
                <th>日付</th>
                <th>大項目</th>
                <th>中項目</th>
                <th>小項目</th>
                <th>金額</th>
                <th>合計金額</th>
                <th>詳細</th>
                <th>編集</th>
                <th>削除</th>
              </tr>
            </thead>
            <tbody>
              {[...transactions]
                .sort((a, b) => b.total_amount - a.total_amount) // 降順ソート
                .map(tx => (
                  <tr key={tx._id}>
                  {console.log('データの中身', transactions)}
                  <td>{tx.user_id?.user_name || "不明"}</td>
                  <td>{tx.trans_date !== null ? new Date(tx.trans_date).toLocaleString() : "-"}</td>
                  <td>{majorItemsENToJA[tx.category_id?.category_major]}</td>
                  <td>{middleItemsENToJA[tx.category_id?.category_middle]}</td>
                  <td>{tx.category_id?.category_minor || "-"}</td>
                  <td>{tx.amount !== null ? tx.amount : "-"}円</td>
                  <td>{tx.total_amount !== null ? tx.total_amount : "-"}円</td>
                  <td>{tx.memo || "-"}</td>
                  <td>
                    <div className={styles.tableRowBtn}>
                      <button className={styles.customizeRow_btn} onClick={() => {
                        setSelectedTransaction(tx);
                        setIsModalOpen(true);
                      }}>
                        <span>編集する</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
                          <path stroke="currentColor" strokeWidth="0.8" d="m5.791 3.5 3.709 3H2"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td>
                  <div className={styles.tableRowBtn}>
                    <button className={styles.customizeRow_btn} onClick={() => handleDeleteTransaction(tx._id, tx.user_id?.user_name)}>
                      <span>削除する</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
                        <path stroke="currentColor" strokeWidth="0.8" d="m5.791 3.5 3.709 3H2"></path>
                      </svg>
                    </button>
                  </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* モーダル画面表示 */}
          {isModalOpen && selectedTransaction && (
            <AdminDashboardEditModal
              transaction={selectedTransaction}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveTransaction}
            />
          )}
        </div>
      </div>
    </main>
  )
};

export default AdminDashboardData;