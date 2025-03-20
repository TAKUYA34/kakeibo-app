import React from 'react';
import styles from '../styles/OverView.module.css';

const OverView = () => {

  // カードとテキストを一元化
  const layer1items = [
    {
      image: "/images/mainImageA.jpg",
      text: "収支や支出の管理がラクになります",
    },
    {
      image: "/images/mainImageB.jpg",
      text: "カテゴリ毎に管理することも可能です",
    },
    {
      image: "/images/mainImageC.jpg",
      text: "現在の収支を簡単に可視化することが可能です",
    },
  ];
  
  return (
    // mainPage1
    <section className={styles.main}>
      <div className={styles.main_layer}>
        <h2 className={styles.mainTitle}>Over View.</h2>
        <p className={styles.mainSubTitle}>概 要</p>
      </div>

      <div className={styles.overview_container}>
        {layer1items.map((item, index) => (
          <div key={index} className={styles.overview_item}>
            <img src={item.image} alt="layerImage" className={styles.overview_image} />
            <p className={styles.overview_text}>{item.text}</p>
          </div>
        ))}
      </div>

      <button className={styles.overview_button}>
        <span className={styles.button_text}>MORE...</span>
        <div className={styles.arrow}>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
            <path stroke="currentColor" strokeWidth="0.8" d="m5.791 3.5 3.709 3H2"></path>
          </svg>
        </div> 
      </button>
    </section>
  );
};

export default OverView