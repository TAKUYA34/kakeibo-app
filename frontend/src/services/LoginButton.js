import { useAuth } from "/services/AuthContext";

const LogoutButton = () => {
  const { logout } = useAuth();

  return <button onClick={logout}>ログアウト</button>;
};

export default LogoutButton;