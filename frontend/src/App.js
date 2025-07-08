import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./services/AuthContext.js";
import Register from "./pages/Register.js";
import Login from "./pages/Login.js";
import Home from "./pages/Home.js";
import Transactions from "./pages/Transactions.js";
import TransDataList from "./pages/TransDataList.js";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/home/register" element={<Register />} />
          <Route path="/home/login" element={<Login />} />
          <Route path="/home/transactions/add" element={<Transactions />} />
          <Route path="/home/transactions/list" element={<TransDataList />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;