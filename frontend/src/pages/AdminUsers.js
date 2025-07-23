// pages/AdminUsers.js

import AdminHeader from "../components/AdminHomeScreen/AdminHeader";
import AdminUsersManagementData from "../components/AdminMenuScreen/AdminUsersManagementData";
import AdminFooter from "../components/AdminHomeScreen/AdminFooter";

const AdminUsers = () => {
  return (
    <>
      <AdminHeader />
      <AdminUsersManagementData />
      <AdminFooter />
    </>
  );
}

export default AdminUsers;