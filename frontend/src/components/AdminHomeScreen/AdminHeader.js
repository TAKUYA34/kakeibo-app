import { useAdminAuth } from '../../services/AdminAuthContext'; // 管理者認証コンテキスト
import styles from '../../styles/AdminHomeStatic/AdminHeader.module.css';
import { Link } from 'react-router-dom'; // ルートを切り替え

const AdminHeader = () => {
  const { adminUser, logout } = useAdminAuth(); // 管理者ユーザー情報を取得

  const handleLogout = () => {
    const confirmLogout = window.confirm('ログアウトしますか？');
    if (confirmLogout) {
      logout(); // ログアウト処理を実行
    }
  };

  return (
    <>
      <header className={!adminUser ? styles.loginHeader : ''}>
        <div className={styles.adminHeaderContainer}>
          <h1>
            <Link to="/admin/home" style={{ textDecoration: 'none', color: 'inherit' }}>
              Kakeibo-App
            </Link>
          </h1>
          {adminUser && (
          <div className={styles.adminNavContainer}>
            <nav>
              <ul>
                <li>
                  <Link to="/admin/home/users">ユーザー管理</Link>
                </li>
                <li>
                  <Link to="/admin/home/dashboard">ユーザー取引管理</Link>
                </li>
                <li>
                  <Link to="/admin/home/report">お知らせ管理</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className={styles.logoutButton}>ログアウト</button>
                </li>
              </ul>
            </nav>
          </div>
          )}
        </div>
      </header>
      <div style={{
        height: '150px',
        background: 'linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem'
        }}>
      </div>
    </>
  );
} 

export default AdminHeader;