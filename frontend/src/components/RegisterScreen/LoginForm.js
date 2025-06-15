import React, { useState } from "react";
import { useAuth } from "../../services/AuthContext";
import styles from '../../styles/RegisterStatic/LoginForm.module.css'; // スタイルシートのインポート
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    // 空白や＠を含まない文字を一文字以上入力する正規表現チェック
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("無効なメールアドレスです");
      return;
    }

    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください");
      return;
    }

    setLoading(true);

    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate("/home"); // ログイン成功時にダッシュボードへ遷移
    } else {
      setError("ログイン失敗: メールアドレスまたはパスワードが違います");
    }
  };

  return (
    <div className={styles.loginMain}>
      <h1 className={styles.headerTitle}>
        <a className={styles.navList_a} href='/home' target="_self">Kakeibo-app</a>
      </h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className={styles.LoginContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="email">メールアドレス</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="password">パスワード</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <button type="submit" className={styles.LoginBtn} disabled = {loading || !email || !password}>{loading ? "ログイン中..." : "ログイン"}</button>
      </form>
    </div>
  );
};

export default Login;