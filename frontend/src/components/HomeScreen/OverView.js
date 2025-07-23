import React from 'react';
import { useAuth } from '../../services/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/HomeStatic/OverView.module.css';

const OverView = () => {

  const { user, isLoading } = useAuth(); // useAuthフックを使用して認証情報を取得
  const navigate = useNavigate();

  const handleButtonClick = () => {
    
    if (!isLoading && !user) {
      // ユーザーがログインしていない場合、ログインページにリダイレクト
      navigate('/home/login');
      return;
    } else {
      // ボタンがクリックされたときの処理
      navigate('/home/transactions/add');
    }
  };
  
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
    // mainScreen1
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

      <button className={styles.overview_button} onClick={handleButtonClick}>
        <span className={styles.button_text}>家計簿を登録する.</span>
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