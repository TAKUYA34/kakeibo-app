/* PasswordReEnrollment.js */
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../../styles/PasswordStatic/PasswordReEnrollment.module.css';

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      if (newPassword !== confirmPassword) {
        setMessage('パスワードが一致しません。');
      return;
}
      await axios.post('http://localhost:5001/api/auth/password/reset-password', {
        token,
        newPassword
      });
      setMessage('パスワードがリセットされました。ログインしてください。');

      // フィールドをリセット
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage('パスワードリセットに失敗しました。');
    }
  };

  return (
    <div className={styles.passwordReEnrollmentContainer}>
      <div className={styles.reEnrollmentHeader_row}>
        <a href='/home' target="_self" className={styles.reEnrollmentHeaderAndMessageContent}>
          <h2>Kakeibo App</h2>
        </a>
      </div>
      <h1>Reset Password</h1>
      <p>新しいパスワードを入力してください</p>
      <div className={styles.reEnrollmentForm_row}>
        <form onSubmit={handleSubmit}>
          <label>新しいパスワード</label>
          <input
            type="password"
            placeholder="新しいパスワードを設定してください"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <label>確認</label>
          <input
            type="password"
            placeholder="新しいパスワードを再入力してください"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className={styles.reEnrollmentSubmit_btn}>リセットする</button>
        </form>
        <div className={styles.reEnrollmentMessage_row}>
          <p>{message}</p>
          {message && (
            <a href="/home/login" className={styles.reEnrollmentHeaderAndMessageContent}>ログイン画面へ</a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;