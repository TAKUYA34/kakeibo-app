import styles from '../../styles/MenuStatic/ProfileEdit.module.css';
import { useState } from "react";
import { useAuth } from "../../services/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfileEdit = () => {

  const { user, setUser, logout } = useAuth(); // user情報を取得、logoutを使用
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Navigateを使用してリダイレクト

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

  useEffect(() => {

    // 初期値にユーザー情報を設定
    if (user) {
      setUsername(user.user_name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // トークンを取得

      const res = await fetch(`${API_URL}/api/home/profile/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // トークンで認証
        },
        body: JSON.stringify({
          user_name: username,
          email: email,
          password: password || undefined // パスワードが空の場合はundefinedにする
        }),
      });
      console.log("Profile updated:", res.ok ); // デバッグ用ログ

      if (!res.ok) {
        throw new Error("更新に失敗しました");
      }

      setUser({
        ...user,
        user_name: username,
        email: email
      });

      alert("プロフィールを更新しました");
      navigate("/home/profile");
    } catch (err) {
      console.error(err);
      alert("プロフィールの更新中にエラーが発生しました: " + err.message);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    const confirmed = window.confirm("本当にアカウントを削除しますか？"); // OK/キャンセルの確認ダイアログ
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token"); // トークンを取得

      const res = await fetch(`${API_URL}/api/home/profile/delete`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}` // トークンで認証
        }
      });

      if (!res.ok) {
        throw new Error("アカウントの削除に失敗しました");
      }

      alert("アカウントを削除しました");
      logout(); // 認証情報をクリア
      navigate("/home/login"); // ログイン画面にリダイレクト
    } catch (err) {
      console.error(err);
      alert("アカウントの削除中にエラーが発生しました: " + err.message);
    }
  };

  return (
    <div className={styles.profileEditContainer}>
      <div className={styles.profileEditImage} />
      <h1>Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.profile_row}>
            <div>
              <label>お名前</label><br />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label>メールアドレス</label><br />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label>パスワード</label><br />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="空欄の場合は変更なし"
              />
            </div>
          </div><hr />
          <div className={styles.btn_row}>
            <h1>Profile Update</h1>
            <button type="submit" className={styles.edit_btn}>
              <span className={styles.text_btn}>更新する</span>
              <svg className={styles.btn_icon} xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
                <path stroke="currentColor" strokeWidth="0.8" d="m5.791 3.5 3.709 3H2"></path>
              </svg>
            </button><hr />
            <h1>Profile Delete</h1>
            <button type="button" onClick={handleDelete} className={styles.delete_btn}>
              <span className={styles.text_btn}>削除する</span>
              <svg className={styles.btn_icon} xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
                <path stroke="currentColor" strokeWidth="0.8" d="M2 2l8 8M2 10l8-8"></path>
              </svg>
            </button>
          </div>
        </form>
    </div>
  );
}

export default ProfileEdit;