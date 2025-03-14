import React from 'react';
import styles from '../css/Dashboard.module.css';  // CSS Modulesをインポート

const App = ({ user, handleLogout }) => {
  return (
    <div className={styles.container}>
      {/* 画像 */}
      <div className='styles.imageContainer'>
        <img
          className={styles.image}
          src='/images/mainimage.JPG'
          alt='mainimage'
        />
      </div>

      {/* ヘッダー */}
      <header className={`${styles.header} ${styles.wrapper}`}>
        <h1 className={styles.headerTitle}>Kakeibo-app</h1>
        <p className={styles.htext}>Simple Money Logs...</p>
        <nav>
          <ul className={styles.navList}>
            <li className={styles.navItem}>Sign up</li>
            <li className={styles.navItem}>Log out</li>
            <li className={styles.navItem}>Menus</li>
          </ul>
        </nav>
      </header>

      {/* メインコンテンツ */}
      <div className={styles.mainContent}>
        <h2 className={styles.mainTitle}>お待ちしておりました, {user?.email} さん</h2>
        <button onClick={handleLogout} className={styles.button}>
          ログアウト
        </button>
      </div>
    </div>
  );
};

export default App;