import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../services/AdminAuthContext";
  
const AdminLoginForm = () => {

  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password); // ログイン処理
      navigate("/admin/home"); // 管理画面へリダイレクト
    } catch (err) {
      alert("ログイン失敗: " + err.message);
    }
  };
  
  return (
    <form onSubmit={handleLogin}>
      <h1>Admin Login</h1>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
      <button type="submit">ログイン</button>
    </form>
  );
};

export default AdminLoginForm;
