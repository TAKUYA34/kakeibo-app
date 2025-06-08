import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import styles from '../../styles/HomeStatic/Header.module.css';

// 各ページでヘッダーの表示を制御するためのカスタムフック
const Header = ({ text = "Simple Money Logs..." }) => {
  // useAuthフックを使用して認証情報を取得
  const { user, logout } = useAuth();

    // header画像のリスト
  const imagesArray = [
    '/images/headerimageA.JPG',
    '/images/headerimageB.JPG',
    '/images/headerimageC.JPG'
  ];

  // useLocationフックを使用して現在のパスを取得
  const location = useLocation();
  // 現在のパスを取得
  const path = location.pathname;

  // 条件設定
  const isHomePage = path === '/home' || path === '/';
  const isSignUpPage = path === '/home/register' || path === '/home/signUpForm/';
  const isLoginPage = path === '/home/login';
  // header画像インデックス
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImage, setShowImage] = useState(true); // 画像表示フラグ

  // headerテキスト
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // image画像がなければ処理実行
    if (!imagesArray || imagesArray.length === 0) {
      console.error('画像リストが空 or undefined:', imagesArray);
      return;
    }
  
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex(currentIndex + 1)
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      // テキストが全て表示されたら、リセットする
      const resetTimeout = setTimeout(() => {
        setDisplayedText("");
        setCurrentIndex(0);
      }, 3000);
      return () => clearTimeout(resetTimeout);
    }
  }, [currentIndex, text]);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setShowImage(false); // 画像を非表示

      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagesArray.length);
        setShowImage(true); // 画像を表示
      }, 1250);
    }, 8000);

    return () => clearInterval(intervalId);
  }, []);
  
  return (
    // headerScreen
    <>
      {(!isSignUpPage && !isLoginPage) && (
        <main className={styles.mainContainer}>

          {/* 画像のコンテナ */}
            <div className={styles.imageContainer}>
              <img
                className={`${styles.image} ${showImage ? styles.show : ''}`}
                src={imagesArray[currentImageIndex]}
                alt="headerImage"
                onError={() => console.log('画像の読み込みに失敗:', imagesArray[currentImageIndex])} // エラーログ
                />
            </div>

        
          {/* header */}
          <header className={`${styles.header} ${styles.wrapper}`}>
          <p className={styles.htext}>{displayedText}</p>
            <div className={styles.fixation}>
              <h1 className={styles.headerTitle}>
                <a className={styles.navList_a} href='/home' target="_self">Kakeibo-app</a>
              </h1>
              <nav>
                <ul className={styles.navList}>
                  { !user && (
                    <>
                    <li className={styles.navItem}>
                      <a className={styles.navList_a} href='/home/register' target="_self">Sign up</a>
                    </li>
                    <li className={styles.navItem}>
                      <a className={styles.navList_a} href='/home/login' target='_blank'>Log in</a>
                    </li>
                    </>
                  )}
                  { user && (
                    <>
                    <li className={styles.navItem}>
                      <span className={styles.navList_a}>{user.name}</span>
                    </li>
                    <li className={styles.navItem}>
                      <button className={styles.navList_a} onClick = {logout}>Log out</button>
                    </li>
                    </>
                  )}
                  <li className={styles.navItem}>
                    <a className={styles.navList_a} href='#' target='_blank'>Menus</a>
                  </li>
                </ul>
              </nav>
            </div>
          </header>
        </main>
      )}
    </>
  );
};

export default Header;