/* RequestPasswordReset.js */
import { useState } from "react";
import axios from "axios";
import styles from "../../styles/PasswordStatic/RequestPasswordReset.module.css";

const RequestPasswordReset = () => {
  
  const [email, setEmail] = useState('');

  const handleSubmit = async () => {
    await axios.post('http://localhost:5001/api/auth/password/request', { email });
    alert('パスワードをリセットするメールを送信しました');
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
          <input type="email" value={email} placeholder="例：email@example.com" onChange={e => setEmail(e.target.value)} />
          <button type="submit" className={styles.requestSubmit_btn}>送信</button>
        </form>
      </div>
    </div>
  );
}

export default RequestPasswordReset;