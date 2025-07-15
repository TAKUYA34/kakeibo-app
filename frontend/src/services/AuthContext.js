import { createContext, useState, useContext, useEffect } from "react";

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      console.log('res.ok', res.ok);
      if (!res.ok) throw new Error("ログインに失敗しました");
      
      const data = await res.json();
      const token = data.token;

      localStorage.setItem("token", token); // トークンをローカルストレージに保存
      // トークンを使ってユーザー情報を取得
      const meRes = await fetch(`${API_URL}/api/home/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!meRes.ok) throw new Error("ユーザー情報の取得に失敗しました");

      const userData = await meRes.json();
      setUser({
        _id: userData._id, // ユーザーIDも保存
        user_name: userData.user_name, // ユーザー名も保存
        email: userData.email
       }); // 状態を更新

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
      fetch(`${API_URL}/api/home/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.email) {
            setUser({
              _id: data._id, // ユーザーIDも保存
              email: data.email,
              user_name: data.user_name
            }); // ユーザー情報を状態にセット
          } else {
            setUser(null);
            localStorage.removeItem("token"); // 不要なトークン削除
          }
          setIsLoading(false); // 認証確認完了
        })
        .catch(() => {
          localStorage.removeItem("token"); // 失敗したらトークン削除
          setUser(null);
          setIsLoading(false); // 認証確認完了
        });
    } else {
      setIsLoading(false); // トークンがない場合も認証確認完了
    }
  }, [API_URL]);

  // ログアウト処理
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token"); // ローカルストレージからトークン削除
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 他のコンポーネントで使いやすくするカスタムフック
export const useAuth = () => {
  return useContext(AuthContext);
};