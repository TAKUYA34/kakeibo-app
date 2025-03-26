import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./api/AuthContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home.js";
import SignUpForm from "./components/SignUpForm.js";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/com/Test" element={<SignUpForm />} />
          <Route path="/" element={<Home />} />
          <Route path="/Home/SignUp" element={<Register />} />
          <Route path="/Home/login" element={<Login />} />
          <Route path="/Home" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;