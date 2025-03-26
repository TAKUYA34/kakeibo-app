// src/components/SignUpForm.js
import React, { useState } from 'react';
import { signUp } from '../api/authService'; // サインアップAPIを呼び出す関数

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = formData;

    if (!username || !email || !password) {
      setError('全てのフィールドを入力してください');
      return;
    }

    try {
      const response = await signUp(username, email, password);
      if (response.success) {
        alert('サインアップに成功しました');
      } else {
        setError(response.message || 'サインアップに失敗しました');
      }
    } catch (error) {
      setError('サーバーエラーが発生しました');
    }
  };

  return (
    <div>
      <h2>サインアップ</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">ユーザー名:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">メールアドレス:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">パスワード:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">サインアップ</button>
      </form>
    </div>
  );
};

export default SignUpForm;