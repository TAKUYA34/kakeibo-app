// components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth(); // nullなら未ログイン

  if (isLoading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/home/login" replace />; // リダイレクト
  }

  return children;
};

export default PrivateRoute;