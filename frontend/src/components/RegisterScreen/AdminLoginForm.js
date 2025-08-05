import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../services/AdminAuthContext";
import { toast } from 'react-toastify';
import styles from "../../styles/AdminLoginStatic/AdminLoginForm.module.css"; // スタイルをインポート
  
const AdminLoginForm = () => {

  const { login, adminUser } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  // ログイン済みは/admin/homeへリダイレクト
  useEffect(() => {
    if (adminUser) {
      navigate("/admin/home");
    }
  }, [adminUser, navigate]);

  // ログイン処理
  const handleLogin = async (e) => {
    e.preventDefault(); // フォームのデフォルトの送信を防ぐ
    try {
      await login(email, password); // ログイン処理
      navigate("/admin/home"); // 管理画面へリダイレクト
    } catch (err) {
      toast.error("ログイン失敗: " + err.message);
    }
  };
  
  return (
    <form onSubmit={handleLogin}>
      <div className={styles.loginContainer}>
        <h1>Admin Login</h1>
        <div className={styles.inputGroup}>
          <label htmlFor="email">メールアドレス</label>
          <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />

          <label htmlFor="password">パスワード</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
        </div>
        <button type="submit" className={styles.login_btn}>ログイン</button>
      </div>
    </form>
  );
};

export default AdminLoginForm;
