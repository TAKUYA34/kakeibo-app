import React, { useEffect, useState } from 'react';
import { useAuth } from '../../services/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../../styles/HomeStatic/WhatsNew.module.css';

const WhatsNew = () => {

  const { user, isLoading } = useAuth(); // useAuthフックを使用して認証情報を取得
  const navigate = useNavigate();

  // useState
  const [notices, setNotices] = useState([]);
  const [page, setPage] = useState(1); // 初期のページ
  const [hasMore, setHasMore] = useState(true) // 件数フラグ

  // token取得
  const token = localStorage.getItem('token');

  // DBからお知らせデータを取得する
  useEffect(() => {
    axios.get(`http://localhost:5001/api/home/notices?page=${page}&limit=3`, {
      headers: {Authorization: `Bearer ${token}`}
    })
      .then(res => {
        const { notices: newNotices, totalCount } = res.data;

        setNotices(newNotices);

        // 総件数と現在の位置で「次があるか」判定
        const totalPages = Math.ceil(totalCount / 3);
        setHasMore(page < totalPages);
      })
      .catch(err => console.error(err));
  }, [page]);

  const handleButtonClick = () => {
    
    if (!isLoading && !user) {
      // ユーザーがログインしていない場合、ログインページにリダイレクト
      navigate('/home/login');
      return;
    } else {
      // ボタンがクリックされたときの処理
      navigate('/home/transactions/list');
    }
  };

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
            { notices.map((notice) => (
              <li className={styles.whatsNew_item}>
                <strong>{new Date(notice.notice_date).toLocaleDateString()}</strong><br />
                {notice.content}
              </li>
            ))}
          </ul>
            <div className={styles.paginationWrapper}>
              <p>{page}ページ目</p>
              <div className={styles.paginationBtnList}>
                <button disabled={page === 1} onClick={() => setPage(prev => prev - 1)} className={styles.pagination_btn}>
                  <span>前へ</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
                    <path stroke="currentColor" strokeWidth="0.8" d="m5.791 3.5 3.709 3H2"></path>
                  </svg>
                </button>
                <button disabled={!hasMore} onClick={() => setPage(prev => prev + 1)} className={styles.pagination_btn}>
                  <span>次へ</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
                    <path stroke="currentColor" strokeWidth="0.8" d="m5.791 3.5 3.709 3H2"></path>
                  </svg>
                </button>
              </div>
            </div>
        </div>
        {/* 取引リストへ */}
        <button className={styles.whatsNew_button} onClick={handleButtonClick}>
          <span className={styles.button_text2}>Transaction List...</span>
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