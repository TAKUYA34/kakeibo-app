/* RequestPasswordReset.js */
import { useState } from "react";
import axios from "axios";
import styles from "../../styles/PasswordStatic/RequestPasswordReset.module.css";

/* パスワードのリセットをリクエストする */
const RequestPasswordReset = () => {
  // useState
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(''); // メッセージ用
  const [error, setError] = useState(null); // エラーメッセージ用

  const handleSubmit = async (e) => {
    e.preventDefault(); // フォーム送信のデフォルト動作を防止

    try {
      await axios.post('http://localhost:5001/api/auth/password/request', { email });
      setMessage('パスワードをリセットするリクエストメールを送信しました');
      setError(null);
    } catch (err) {
      // console.error(err);
      setError('エラーが発生しました。メールアドレスをご確認ください。');
      setMessage('');
    }
  };

  return (
    <div className={styles.requestPasswordResetContainer}>
      <div className={styles.header_row}>
        <a href='/home' target="_self" className={styles.headerContent}>
          <h2>Kakeibo App</h2>
        </a>
      </div>
      <h1>Request Re Password</h1>
      <p>登録したメールアドレスを入力してください</p>
      <div className={styles.requestPasswordForm_row}>
        <form onSubmit={handleSubmit}>
          <label>メールアドレス</label>
          <input type="email" value={email} placeholder="例：email@example.com" onChange={e => setEmail(e.target.value)} required/>
          <button type="submit" className={styles.requestSubmit_btn}>送信</button>
        </form>

        {/* 送信ボタン押下後のメッセージ表示 */}
        {message && <p className={styles.successMessage}>{message}</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );
}

export default RequestPasswordReset;