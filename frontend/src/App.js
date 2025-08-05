import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate } from "react-router-dom";
// ユーザー用
import { AuthProvider } from "./services/AuthContext.js";
import PrivateRoute from "./services/PrivateRoute.js";
import Register from "./pages/Register.js";
import Login from "./pages/Login.js";
import Home from "./pages/Home.js";
import Transactions from "./pages/Transactions.js";
import TransDataList from "./pages/TransDataList.js";
import ExportData from "./pages/ExportData.js";
import UsersEdit from "./pages/UsersEdit.js";
import PasswordReset from "./pages/PasswordReset.js";
import PasswordReRegister from "./pages/PasswordReRegister.js";
import InfoPage from "./pages/InfoPage.js";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer />
        <Routes>
          {/* 一般ユーザー画面 認証不要 */}
          <Route path="/home/login" element={<Login />} />
          <Route path="/home/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/home/login/password/reset" element={<PasswordReset />} />
          <Route path="/home/login/password/reset/confirm" element={<PasswordReRegister />} />
          <Route path="/home/info" element={<InfoPage />} />
          <Route path="/" element={<Navigate to="/home" /> }/>

          {/* 一般ユーザー画面 認証が必要 */}
          <Route
            path="/home/transactions/add"
            element={
              <PrivateRoute>
                <Transactions />
              </PrivateRoute>
            }
          />
          <Route
            path="/home/transactions/list"
            element={
              <PrivateRoute>
                <TransDataList />
              </PrivateRoute>
            }
          />
          <Route
            path="/home/export"
            element={
              <PrivateRoute>
                <ExportData />
              </PrivateRoute>
            }
          />
          <Route
            path="/home/profile"
            element={
              <PrivateRoute>
                <UsersEdit />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;