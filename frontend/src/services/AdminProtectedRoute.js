// src/routes/AdminProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../services/AdminAuthContext";

// 管理者認証を行うための保護されたルートコンポーネント JWT認証を使用
const AdminProtectedRoute = ({ children }) => {
  const { adminUser, loading } = useAdminAuth();

  if (loading) return <div>Loading...</div>;

  return adminUser ? children : <Navigate to="/admin/login" replace />;
};

export default AdminProtectedRoute;