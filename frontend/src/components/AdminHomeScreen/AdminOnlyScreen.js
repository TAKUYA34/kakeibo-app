import React, { useEffect, useState } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAdminAuth } from '../../services/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/AdminHomeStatic/AdminOnlyScreen.module.css';

// ダミーデータに difference を追加
const dummyMonthlyData = [
  { month: '4月', income: 120000, expense: 90000, difference: 30000 },
  { month: '5月', income: 100000, expense: 95000, difference: 5000 },
  { month: '6月', income: 130000, expense: 110000, difference: 20000 }
];

// ダミーデータ
const dummyCategoryData = [
  { name: '食費', value: 40000 },
  { name: '交通費', value: 20000 },
  { name: '娯楽', value: 15000 },
  { name: 'その他', value: 10000 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#ff4842ff', '#8442ffff', '#ec42ffff'];

const AdminOnlyScreen = ({ children }) => {

  // useState
  const { adminUser, loading } = useAdminAuth();
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 統計useState
  const [stats, setStats] = useState(null);

  // navigate 初期化
  const navigate = useNavigate();
  
  // 一般ユーザー全てのデータを取得し、カテゴリ毎に分ける
  useEffect(() => {
    // tokenが切れたらloginページへ
    if (!adminUser && !loading) {
      setIsLoading(false);
      navigate('/admin/login');
    }

    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/admin/home/data", {
          method: "GET", // デフォルトはGETだが明示的に記載する
          credentials: 'include'
        });
        if (!res.ok) {
          throw new Error("Fetch failed");
        }
        const data = await res.json();

        // APIの返却形式に応じて分岐
        setMonthlyData(data.monthlyData?.length > 0 ? data.monthlyData : dummyMonthlyData);
        setCategoryData(data.categoryData?.length > 0 ? data.categoryData : dummyCategoryData);
      } catch (err) {
        console.error("データの取得に失敗しました", err);
        // 失敗したらダミーデータを表示する
        setMonthlyData(dummyMonthlyData);
        setCategoryData(dummyCategoryData);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [adminUser, loading, navigate]);

  useEffect(() => {
    if (!adminUser) {
      setIsLoading(false);
      return; // 未ログイン時は処理しない
    }

    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/admin/home/stats", {
          method: "GET",
          credentials: 'include'
        });

        if (!res.ok) {
          throw new Error("Fetch failed");
        }
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("統計データ取得エラー:", err);
      }
    };

    fetchStats();
  }, [adminUser]);

  if (isLoading) {
    return <p>読み込み中...</p>;
  }
  
  return (
    <main>
      <div className={styles.AdminOnlyScreenContainer}>
      <div className={styles.AdminOnlyScreenImage} />
        <h1>ユーザー全体の統計</h1>

      {stats && (
        <>
          <div className={styles.statsCardContainer}>
            <div className={styles.statCard}>
              <h3>総ユーザー数</h3>
              <p>{stats.totalUsers.toLocaleString()}人</p>
            </div>
            <div className={styles.statCard}>
              <h3>今月の取引数</h3>
              <p>{stats.monthlyTransactions.toLocaleString()}件</p>
            </div>
            <div className={styles.statCard}>
              <h3>今月の総支出</h3>
              <p>{stats.monthlyExpense.toLocaleString()}円</p>
            </div>
          </div><hr />
        </>
      )}

        <div className={styles.chartSection}>
          <h2>月別収支の推移</h2>
          <ResponsiveContainer width="100%" height={500} minHeight={500}>
            <ComposedChart data={monthlyData} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#84fab0" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8fd3f4" stopOpacity={0.8}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff9a9e" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#fad0c4" stopOpacity={0.8}/>
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="black" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />

              {/* 棒グラフ */}
              <Bar dataKey="income" barSize={20} fill="url(#colorIncome)" name="収入" radius={[10, 10, 0, 0]} />
              <Bar dataKey="expense" barSize={20} fill="url(#colorExpense)" name="支出" radius={[10, 10, 0, 0]} />

              {/* 折れ線グラフ */}
              <Line type="monotone" dataKey="difference" stroke="#8884d8" strokeWidth={3} name="収支差額" dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div><hr />

        <div className={styles.chartSection}>
          <h2>カテゴリ別支出割合</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData.map(item => ({ ...item, value: Math.abs(item.value) }))} // 表示データ
                cx="50%" // X位置
                cy="50%" // Y位置
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={8} // 各ピースの間のスペース
                dataKey="value" // 各データの合計値
                label={({ name, percent }) => `${name ?? ''} ${(percent ? (percent * 100).toFixed(0) : 0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={5} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 子要素（例えば詳細リンクなど）をここに表示 */}
        {children}
      </div>
    </main>
  );
};

export default AdminOnlyScreen;