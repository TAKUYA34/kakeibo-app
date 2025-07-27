import styles from "../../styles/AdminHomeStatic/AdminFooter.module.css";

const AdminFooter = () => {
  return (
    <footer>
      <div className={styles.footerContainer}>
        <p>&copy; Copyright All Rights Reserved. Kakeibo-App {new Date().getFullYear()}.</p>
        <p className={styles.adminFooterMenu}>
          管理者向けページ | <a href='/admin/home' target='_self'>ヘルプ</a> |&nbsp;
          <a href='/admin/home' target='_self'>システム設定</a>
        </p>
        <p className="mt-1 text-gray-400">Ver. 1.0.0 | Last update: {`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`}</p>
      </div>
    </footer>
  );
}

export default AdminFooter;