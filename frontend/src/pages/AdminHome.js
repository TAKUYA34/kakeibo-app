// pages/AdminHome.js

import AdminHeader from "../components/AdminHomeScreen/AdminHeader";
import AdminOnlyScreen from "../components/AdminHomeScreen/AdminOnlyScreen";
import AdminFooter from "../components/AdminHomeScreen/AdminFooter";

const AdminHome = () => {
  return (
    <>
      <AdminHeader />
      <AdminOnlyScreen />
      <AdminFooter />
    </>
  );
}

export default AdminHome;