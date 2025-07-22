import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminAuthProvider } from './services/AdminAuthContext';
import AdminProtectedRoute from './services/AdminProtectedRoute';

// 管理者各画面
import AdminLogin from './pages/AdminLogin';
import AdminHome from './pages/AdminHome';
import AdminReport from './pages/AdminReport';
import AdminDashboard from './pages/AdminDashboard';


const AdminApp = () => (
  <AdminAuthProvider>
    <BrowserRouter>
      <Routes>
        {/* 管理者画面 認証不要 */}
        <Route path="/admin/login" element={<AdminLogin />} />
        {/* 管理者画面 認証必要 */}
        <Route
          path="/admin/home"
          element={
          <AdminProtectedRoute>
            <AdminHome />
          </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/home/report"
          element={
          <AdminProtectedRoute>
            <AdminReport />
          </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/home/dashboard"
          element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </AdminAuthProvider>
);

export default AdminApp;