import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';// メインのAppコンポーネント
import AdminApp from './AdminApp'; // 管理者用のAppコンポーネント
import reportWebVitals from './reportWebVitals';
import "./global.css"; // インポート

// 管理者フラグ
const isAdminPath = window.location.pathname.startsWith('/admin');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(isAdminPath ? (
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
) : (
  <React.StrictMode>
    <App />
  </React.StrictMode>
));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
