import React from 'react';
import styles from '../styles/WhatsNew.module.css';

const WhatsNew = () => {

  return (
    // mainScreen2
    <section className={styles.main2}>
      {/* 画像のコンテナ1 */}
      <div className={styles.shape_container1}>
        <div className={styles.main2Image_container}>
          <img className={styles.main2Image}
            src="/images/main2ImageA.jpg" alt="main2ImageA"
          />
        </div>
      </div>

      {/* 画像のコンテナ2 */}
      <div className={styles.shape_container2}>
        <div className={styles.main2Image_container}>
          <img className={styles.main2Image}
            src="/images/main2ImageB.jpg" alt="main2ImageB"
          />
        </div>
      </div>

      {/* 画像のコンテナ3 */}
      <div className={styles.shape_container3}>
        <div className={styles.main2Image_container}>
          <img className={styles.main2Image}
            src="/images/main2ImageC.jpg" alt="main2ImageC"
          />
        </div>
      </div>

      <div className={styles.main_layer2}>
        <h2 className={styles.mainTitle2}>What’s New.</h2>
        <p className={styles.mainSubTitle2}>最新情報</p>
        <div className={styles.whatsNew_container}>
          <ul className={styles.whatsNew_list}>
            <li className={styles.whatsNew_item}>
              <strong>2025.02.26</strong><br />収入一覧に新機能を追加しました
            </li>
            <li className={styles.whatsNew_item}>
              <strong>2025.02.18</strong><br />カテゴリ機能のソート検索を一部修正しました。
            </li>
            <li className={styles.whatsNew_item}>
              <strong>2024.12.04</strong><br />KakeiboAPPを立ち上げました。
            </li>
          </ul>
        </div>
        <button className={styles.whatsNew_button}>
          <span className={styles.button_text2}>Show Logs...</span>
          <div className={styles.arrow}>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
              <path stroke="currentColor" strokeWidth="0.8" d="m5.791 3.5 3.709 3H2"></path>
            </svg>
          </div> 
        </button>
      </div>
    </section>
  );
};

export default WhatsNew