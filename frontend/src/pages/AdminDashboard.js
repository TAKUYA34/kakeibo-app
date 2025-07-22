// pages/AdminDashboard.js

import AdminHeader from "../components/AdminHomeScreen/AdminHeader";
import AdminDashboardData from "../components/AdminMenuScreen/AdminDashboardData";
import AdminFooter from "../components/AdminHomeScreen/AdminFooter";

const AdminDashboard = () => {
  return (
    <>
      <AdminHeader />
      <AdminDashboardData />
      <AdminFooter />
    </>
  );
}

export default AdminDashboard;