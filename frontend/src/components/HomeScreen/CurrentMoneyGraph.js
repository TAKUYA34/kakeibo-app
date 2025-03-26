import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import styles from '../../styles/CurrentMoneyGraph.module.css';

const CurrentMoneyGraph = () => {

    // グラフデータサンプル
    const data = [
      { name: "1", income: 4000, expense: 2400 },
      { name: "2", income: 3000, expense: 1398 },
      { name: "3", income: 2000, expense: 9800 },
      { name: "4", income: 2780, expense: 3908 },
    ];
    
    // グラフデータサンプル
    const pieData = [
      { name: "Food", value: 400 },
      { name: "Transport", value: 300 },
      { name: "Entertainment", value: 300 },
    ];
    
    // グラフ色
    const COLORS = ["#8b0000", "#ff4500", "#ffa500"];

    return (
    // graphScreen
    <section className={styles.moneyGraph}>
      <div className={styles.moneyGraph_layer}>
        <h2 className={styles.moneyGraph_title}>Current MoneyGraph</h2>
        <p className={styles.moneyGraph_content}>現在の収支・支出</p>
        <div className={styles.graphs}>
          <ResponsiveContainer width="45%" height={500}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#4285F4" />
              <Bar dataKey="expense" fill="#FF3D00" />
            </BarChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="45%" height={500}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={200} fill="#8884d8">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default CurrentMoneyGraph