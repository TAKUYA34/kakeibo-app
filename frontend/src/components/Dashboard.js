import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import '../css/Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* ヘッダー */}
      <header className="bg-blue-200 text-white p-4">
        <h1 className="text4xl font-bold">Kakeibo-app</h1>
      </header>

      {/* メインコンテンツ */}
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl">お待ちしておりました, {user?.email} さん</h2>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 mt-4 rounded">
          ログアウト
        </button>
      </div>
    </div>
  );
};

export default Dashboard;