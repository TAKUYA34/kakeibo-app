import { createContext, useState, useContext, useEffect } from "react";

// ログイン状態を管理するためのコンテキストを作成
const AuthContext = createContext();

// アプリ全体にログイン状態を提供するプロバイダーコンポーネント
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

  // API と連携するログイン処理
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/home/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      if (!res.ok) throw new Error("ログインに失敗しました");
      
      const data = await res.json();
      const token = data.token;

      localStorage.setItem("token", token); // トークンをローカルストレージに保存
      // トークンを使ってユーザー情報を取得
      const meRes = await fetch(`${API_URL}/home/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!meRes.ok) throw new Error("ユーザー情報の取得に失敗しました");

      const userData = await meRes.json();
      setUser({ email: userData.email }); // 状態を更新

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  // ローカルストレージにトークンがあればログイン状態を復元する
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // バックエンドでユーザー情報を取得
      fetch(`${API_URL}/home/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.email) {
            setUser({
              email: data.email,
              user_name: data.user_name
            }); // ユーザー情報を状態にセット
          }
        })
        .catch(() => {
          localStorage.removeItem("token"); // 失敗したらトークン削除
        });
    }
  }, [API_URL]);

  // ログアウト処理
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token"); // ローカルストレージからトークン削除
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 他のコンポーネントで使いやすくするカスタムフック
export const useAuth = () => {
  return useContext(AuthContext);
};