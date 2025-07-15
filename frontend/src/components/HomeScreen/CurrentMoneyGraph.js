import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import styles from '../../styles/HomeStatic/CurrentMoneyGraph.module.css';
import { useAuth } from '../../services/AuthContext';
import { useEffect } from 'react';
import { useState } from 'react';

const CurrentMoneyGraph = () => {

  const { user } = useAuth(); // useAuthフックを使用して認証情報を取得
  const COLORS = ["#8b0000", "#ff4500", "#ffa500", "#32cd32", "#20b2aa"];

  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);

  const labelPieMap = {
    utility: '光熱費',
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

  useEffect(() => {
    if (!user) return;
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
        
      } catch (err) {
        console.error('グラフデータ取得失敗:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <section className={styles.moneyGraph}>
      <div className={styles.moneyGraph_layer}>
        <h2 className={styles.moneyGraph_title}>Current MoneyGraph</h2>
        <p className={styles.moneyGraph_content}>現在の収支・支出</p>
        <div className={styles.graphs}>
          <ResponsiveContainer width="45%" height={500}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  const labelMap = { income: '収入', expense: '支出' };
                  return [value, labelMap[name] || name];
                }}
              />
              <Bar dataKey="income" fill="#4285F4" />
              <Bar dataKey="expense" fill="#FF3D00" />
            </BarChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="45%" height={500}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="middle"
                outerRadius={200}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, entry) => {
                  const { middle, minor } = entry?.payload || {};
                  const labelMiddle = labelPieMap[middle] || middle || '不明';
                  const labelMinor = minor || '未分類';
                  return [`¥${value.toLocaleString()}`, `${labelMiddle} / ${labelMinor}`];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default CurrentMoneyGraph