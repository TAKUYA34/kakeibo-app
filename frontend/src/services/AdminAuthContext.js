// src/services/AdminAuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';

// 管理者認証のための箱を作成
const AdminAuthContext = createContext();

// 管理者の情報にアクセスするためのカスタムフック
export const useAdminAuth = () => useContext(AdminAuthContext);

// 管理者認証プロバイダーコンポーネント
export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true); // ローディング状態を管理

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

  // 管理者としてのログイン状態をフロント側で維持し、トークンがあればログイン状態を維持
  useEffect(() => {
    // ローカルストレージからトークンを取得
    const token = localStorage.getItem("admin_token");
    console.log("adminUser:", adminUser);
    if (token) {
      fetch(`${API_URL}/api/admin/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        // レスポンスからユーザー情報を取得し、管理者ユーザーとして設定
        console.log("Fetching admin user data...", data.user);
        if (data?.user?.role === 'admin') {
          setAdminUser(data.user);
          console.log("Admin user set:", data.user);
        } else { // 管理者でない場合はログアウト
          setAdminUser(null);
        }
          setLoading(false); // ローディング状態を解除
        })
        .catch(() => {
          setAdminUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [API_URL]);

  // 管理者ログイン処理
  const login = async (email, password) => {
    // APIにログインリクエストを送信
    const res = await fetch(`${API_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("ログイン失敗");

    const data = await res.json();
    localStorage.setItem("admin_token", data.token); // トークンをローカルストレージに保存
    setAdminUser(data.user); // 認証情報を管理者ユーザーとして設定
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};