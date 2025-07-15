// src/components/SignUpForm.js
import React, { useState } from 'react';
import styles from '../../styles/RegisterStatic/SignUpForm.module.css'; // スタイルシートのインポート
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    password: '',
  });
  
  const [error, setError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    // 空白や＠を含まない文字を一文字以上入力する正規表現チェック
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { user_name, email, password } = formData;

    if (!user_name || !email || !password) {
      setError('すべてのフィールドを入力してください。');
      return;
    }

    if (!validateEmail(email)) {
      setError("無効なメールアドレスです");
      return;
    }

    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください");
      return;
    }

    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/home/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_name, email, password })
      });

      const result = await response.json();

      if (response.ok) {
        alert('サインアップに成功しました');
        navigate('/home/login'); // サインアップ成功後にログインページへリダイレクト
      } else {
        setError(result.message || 'サインアップに失敗しました');
      }
    } catch (error) {
      setError('サーバーエラーが発生しました。後でもう一度お試しください。');
    }
  };

  return (
    <div className={styles.signupFormMain}>
      <h1 className={styles.headerTitle}>
        <a className={styles.navList_a} href='/home' target="_self">Kakeibo-app</a>
      </h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className={styles.signupContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="user_name">お名前</label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
            />
            <label htmlFor="email">メールアドレス</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <label htmlFor="password">パスワード</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <label htmlFor="confirmPassword">パスワード（確認用）</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <button type="submit" className={styles.SignUpBtn}>新規登録</button>
      </form>
    </div>
  );
};
export default SignUpForm;