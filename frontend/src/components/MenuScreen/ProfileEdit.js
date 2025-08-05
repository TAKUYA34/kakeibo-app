import styles from '../../styles/MenuStatic/ProfileEdit.module.css';
import { useState, useEffect } from "react";
import { useAuth } from "../../services/AuthContext";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const ProfileEdit = () => {
  const { user, setUser, logout, isLoading } = useAuth(); // user情報を取得、logoutを使用
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Navigateを使用してリダイレクト

  // バリデーションメッセージ
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

  useEffect(() => {
    if (!user) {
      // ユーザーがログインしていない場合、ログインページにリダイレクト
      navigate('/home/login');
    }
  }, [user, isLoading, navigate]); // userとisLoadingが変化したときに実行される

  useEffect(() => {

    // 初期値にユーザー情報を設定
    if (user) {
      setUsername(user.user_name);
      setEmail(user.email);
    }
  }, [user]);

  /* 変更ボタン押下 */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 入力変更していない場合
    if (username === user.user_name && email === user.email && password === "") {
      setNameError("名前とメールアドレスが変更されていません");
      return;
    }

    // エラーリセット
    setNameError("");
    setEmailError("");
    setPasswordError("");

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

      const data = await res.json(); // errorメッセージも取得する

      console.log("Profile updated:", res.ok ); // デバッグ用ログ
      if (!res.ok) {
        if (data.message.includes("メールアドレス")) {
          setEmailError(data.message);
        } else if (data.message.includes("パスワード")) {
          setPasswordError(data.message);
        } else {
          setNameError(data.message);
        }
        return;
      }

      setUser({
        ...user,
        user_name: username,
        email: email
      });

      toast.success("プロフィールを更新しました");
      navigate("/home/profile");
    } catch (err) {
      console.error(err);
      toast.error("プロフィールの更新中にエラーが発生しました: " + err.message);
    }
  };

  /* 削除ボタン押下 */
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

      toast.success("アカウントを削除しました");
      logout(); // 認証情報をクリア
      navigate("/home/login"); // ログイン画面にリダイレクト
    } catch (err) {
      console.error(err);
      toast.error("アカウントの削除中にエラーが発生しました: " + err.message);
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
            {nameError && <div className={styles.profileErrorForm}>{nameError}</div>}
            <div>
              <label>メールアドレス</label><br />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {emailError && <div className={styles.profileErrorForm}>{emailError}</div>}
            <div>
              <label>パスワード</label><br />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="空欄の場合は変更なし"
              />
            </div>
            {passwordError && <div className={styles.profileErrorForm}>{passwordError}</div>}
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