import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl">ようこそ, {user?.email} さん</h2>
      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 mt-4 rounded">
        ログアウト
      </button>
    </div>
  );
};

export default Dashboard;