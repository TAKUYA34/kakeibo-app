import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LabelList } from "recharts";
import { motion } from 'framer-motion';
import styles from '../../styles/HomeStatic/CurrentMoneyGraph.module.css';
import { useAuth } from '../../services/AuthContext';
import { useEffect } from 'react';
import { useState } from 'react';

const CurrentMoneyGraph = () => {

  // ダミーデータ（初期表示用）
  const dummyBarData = [
    { name: '1月', income: 0, expense: 0 },
    { name: '2月', income: 0, expense: 0 },
    { name: '3月', income: 0, expense: 0 },
  ];
  
  const dummyPieData = [
    { middle: 'other', minor: 'サンプル', value: 1 },
  ];

  const COLORS = ["#78706cff", "#ff4500", "#ffa500", "#32cd32", "#20b2aa", "#9e48b6ff", "#d33990ff"];

  // Graph アニメーション設定
  const animationVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };
  
  // useState
  const { user } = useAuth(); // useAuthフックを使用して認証情報を取得
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);

  const labelPieMap = {
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
  
  useEffect(() => {
    if (!user || !user._id) return;
    const fetchData = async () => {
      try {
        const [barRes, pieRes] = await Promise.all([
          fetch(`http://localhost:5001/api/summary/monthly?userId=${user._id}`),
          fetch(`http://localhost:5001/api/summary/categories?userId=${user._id}`)
        ]);

        const barJson = await barRes.json(); // 収支／支出の合計金額
        const pieJson = await pieRes.json(); // 支出の中、小項目毎の金額
        
        setBarData(barJson);
        setPieData(pieJson);

        console.log('pieでーた', pieJson);
        
      } catch (err) {
        console.error('グラフデータ取得失敗:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <section className={styles.moneyGraph}>
      <div className={styles.moneyGraph_layer}>
        <h2 className={styles.moneyGraph_title}>Current MoneyGraph.</h2>
        <p className={styles.moneyGraph_content}>現在の収支・支出</p>

        <div className={styles.graphTitle_row}>
          <span>当月の収入と支出の合計金額が棒グラフで表示されます.</span>
          <span>当月の各カテゴリ毎に登録したデータの合計金額が円グラフで表示されます.</span>
        </div>
        
        <div className={styles.graphs}>
        <motion.div
          className={styles.graphItem}
          variants={animationVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          >
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={barData.length ? barData : dummyBarData} margin={{ top: 20, right: 40, left: 40, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${value}円`}/>
              <Tooltip 
                formatter={(value, name) => {
                  const labelMap = { income: '収入', expense: '支出' };
                  return [`¥${value.toLocaleString()}円`, labelMap[name] || name];
                }}
              />
              <Legend verticalAlign="top" />
              <Bar dataKey="income" name="収入" fill="#48628eff">
                <LabelList dataKey="income" position="top" formatter={(val) => `${val}円`} />
              </Bar>
              <Bar dataKey="expense" name="収入" fill="#f99779ff">
                <LabelList dataKey="expense" position="top" formatter={(val) => `${val}円`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className={styles.graphItem}
          variants={animationVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie
                data={pieData.length ? pieData : dummyPieData}
                dataKey="value"
                nameKey="minor"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={150}
                paddingAngle={2} // 各ピースの間のスペース
                label={({ name, percent, payload }) => {
                  const displayName = payload.minor || labelPieMap[payload.middle] || name;
                  return `${displayName} (${(percent * 100).toFixed(0)}%)`;
                }}
                >
                {Array.isArray(pieData) && pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /> // 色
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => {
                  const isValid = value !== null && value !== undefined && value !== '';
                  const formattedValue = isValid ? `${value}円` : ''; // valueがnull/undefined/空文字なら非表示
                  return [formattedValue];
                }}
              />
              <Legend
                verticalAlign="bottom"
                formatter={(_, entry) => {
                  const middle = entry.payload.middle; // middleを取得
                  return labelPieMap[middle] || middle;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CurrentMoneyGraph