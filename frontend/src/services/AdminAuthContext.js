// src/services/AdminAuthContext.js
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// 管理者認証のための箱を作成
const AdminAuthContext = createContext();

// 管理者の情報にアクセスするためのカスタムフック
export const useAdminAuth = () => useContext(AdminAuthContext);

// 管理者認証プロバイダーコンポーネント
export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true); // ローディング状態を管理

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

  // 管理者の認証状態取得関数を useCallback で定義（再利用と安定性のため）
  const fetchAdminInfo = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/me`, {
        credentials: 'include', // Cookieをサーバーに送る
      });
      if (!res.ok) throw new Error('認証されていません');
      const data = await res.json();
      if (data?.user?.role === 'admin') {
        setAdminUser(data.user);
      } else {
        setAdminUser(null);
      }
    } catch {
      setAdminUser(null);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // 初期読み込み ＆ タブ再表示時の再読み込み対応
  useEffect(() => {
    // 初期読み込み
    fetchAdminInfo();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchAdminInfo(); // タブがアクティブになった時に再取得
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchAdminInfo]);

  // 管理者ログイン処理
  const login = async (email, password) => {
    // APIにログインリクエストを送信
    const res = await fetch(`${API_URL}/api/admin/login`, {
      method: "POST",
      credentials: 'include', // Cookie有効化
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("ログイン失敗");

    const data = await res.json();

    // 認証情報を管理者ユーザーとして設定
    setAdminUser(data.user);
  };

  const logout = async () => {
    const res = await fetch(`${API_URL}/api/admin/logout`, {
      method: "POST",
      credentials: 'include', // Cookie有効化
    });

    if (!res.ok) throw new Error("ログアウト失敗");

    // ログアウト後はクライアント側の管理者ユーザーをリセットする
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};