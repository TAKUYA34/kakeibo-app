/* RequestResetForm.js */
import { useState } from "react";
import axios from "axios";
import styles from "../../styles/PasswordStatic/RequestPasswordReset.module.css";

const RequestPasswordReset = () => {
  
  const [email, setEmail] = useState('');

  const handleSubmit = async () => {
    await axios.post('/api/auth/password/request', { email });
    alert('リセットメールを送信しました');
  };

  return (
    <div className={styles.requestPasswordResetContainer}>
      <div className={styles.header_row}>
        <a href='/home' target="_self" className={styles.headerContent}>
          <h2>Kakeibo App</h2>
        </a>
      </div>
      <h1>Reset Password</h1>
      <p>あなたのメールアドレスを入力してください</p>
      <div className={styles.requestPasswordForm_row}>
        <form onSubmit={handleSubmit}>
          <input type="email" value={email} placeholder="例：email@example.com" onChange={e => setEmail(e.target.value)} />
          <button type="submit" className={styles.requestSubmit_btn}>送信</button>
        </form>
      </div>
    </div>
  );
}

export default RequestPasswordReset;