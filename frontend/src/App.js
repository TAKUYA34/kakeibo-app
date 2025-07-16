import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./services/AuthContext.js";
import PrivateRoute from "./services/PrivateRoute.js"
import { Navigate } from "react-router-dom";
import Register from "./pages/Register.js";
import Login from "./pages/Login.js";
import Home from "./pages/Home.js";
import Transactions from "./pages/Transactions.js";
import TransDataList from "./pages/TransDataList.js";
import ExportData from "./pages/ExportData.js";
import UsersEdit from "./pages/UsersEdit.js";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 認証不要ページ */}
          <Route path="/home/login" element={<Login />} />
          <Route path="/home/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Navigate to="/home" /> }/>

          {/* 認証が必要な画面 */}
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
      </Router>
    </AuthProvider>
  );
};

export default App;