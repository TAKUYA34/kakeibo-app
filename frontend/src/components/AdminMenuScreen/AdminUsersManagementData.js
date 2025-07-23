/* AdminUsersManagementData.js */
import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../services/AdminAuthContext';
import { useNavigate } from 'react-router-dom';


const AdminUsersManagementData = () => {
  // useState
  const { adminUser, loading } = useAdminAuth();
  
  // navigate 初期化
  const navigate = useNavigate();

  useEffect(() => {
    // tokenが切れたらloginページへ
    if (!adminUser && !loading) {
      navigate('/admin/login');
    }
  }, [adminUser, loading]);

  return (
    <h1>ユーザー管理画面へようこそ</h1>
  )
}

export default AdminUsersManagementData;