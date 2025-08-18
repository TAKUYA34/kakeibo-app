import { createContext, useState, useContext, useEffect, useCallback } from "react";

// ログイン状態を管理するためのコンテキストを作成
const AuthContext = createContext();

// アプリ全体にログイン状態を提供するプロバイダーコンポーネント
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 認証確認フラグ

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

  // API と連携するログイン処理
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/home/login`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("ログインに失敗しました");
      const data = await res.json();
      
      // JWTをlocalStorageなどに保存
      if (data?.result) {
        // 管理目的（Cookieとは別）
        localStorage.setItem("token", data.result);
      }

      // ログイン成功後にユーザー情報取得
      await fetchUserInfo();

      return true;
    } catch (error) {
        console.error("ログインエラー:", error);
      return false;
    }
  };

  // ログイン中ユーザー情報をcookieから取得する
  const fetchUserInfo = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/home/me`, {
        credentials: 'include',
      });

      if (!res.ok) throw new Error("ユーザー情報の取得に失敗しました");

      const data = await res.json();
      if (data?.email) {
        setUser({
          _id: data._id,
          email: data.email,
          user_name: data.user_name,
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("ユーザー情報取得エラー:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  // ログアウト処理
  const logout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/home/logout/flag`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('ログアウト失敗');
      }

      // クライアント側の状態リセット
      localStorage.removeItem("token");

      // ローカルのログイン状態をクリア
      setUser(null);

    } catch (err) {
      console.error('ログアウトAPIエラー:', err.message);
    }
  };

  // 初期読み込み（ログイン復元） + タブアクティブ時のユーザー情報更新
  useEffect(() => {
    fetchUserInfo();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // タブがアクティブになったときに再取得
        fetchUserInfo();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };

  }, [fetchUserInfo]);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isLoading, fetchUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

// 他のコンポーネントで使いやすくするカスタムフック
export const useAuth = () => {
  return useContext(AuthContext);
};