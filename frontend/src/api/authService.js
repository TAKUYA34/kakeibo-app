// src/context/authService.js
export const signUp = async (username, email, password) => {
  try {
    const response = await fetch('https://example.com/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, message: data.message || 'エラーが発生しました' };
    }
  } catch (error) {
    return { success: false, message: 'サーバーエラーが発生しました' };
  }
};