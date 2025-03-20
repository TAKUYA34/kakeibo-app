import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home.js";
import CurrentMoneyGraph from "./components/CurrentMoneyGraph.js";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/com/Test" element={<CurrentMoneyGraph />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;