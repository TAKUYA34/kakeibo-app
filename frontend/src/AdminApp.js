import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './services/AdminAuthContext';
// import AdminPrivateRoute from './services/AdminPrivateRoute';

import AdminLogin from './pages/AdminLogin';
// import AdminDashboard from './pages/admin/AdminDashboard';

const AdminApp = () => (
  <AdminAuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        {/* 他の管理画面ルート */}
      </Routes>
    </BrowserRouter>
  </AdminAuthProvider>
);

export default AdminApp;