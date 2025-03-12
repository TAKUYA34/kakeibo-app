import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

  // API と連携するログイン処理
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("ログインに失敗しました");

      const data = await res.json();
      setUser({ email }); // 状態を更新
      localStorage.setItem("token", data.token); // トークンを保存
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
      fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.email) {
            setUser({ email: data.email });
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