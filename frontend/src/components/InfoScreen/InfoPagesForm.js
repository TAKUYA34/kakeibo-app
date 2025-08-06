// InfoPagesForm.js
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import styles from '../../styles/InfoStatic/InfoPagesForm.module.css';

const InfoPagesForm = () => {
  
  const location = useLocation();
  
  // Refs for navigation
  const kakeiboRef = useRef(null);
  const faqRef = useRef(null);
  const policyRef = useRef(null);
  const contactRef = useRef(null);
  const privacyRef = useRef(null);
  
  // useState
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // ハッシュで指定のページに移動する
  useEffect(() => {
      const hash = location.hash;
      if (hash === '#kakeibo' && kakeiboRef.current) {
        kakeiboRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (hash === '#question' && faqRef.current) {
        faqRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (hash === '#policy' && policyRef.current) {
        policyRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (hash === '#contact' && contactRef.current) {
        contactRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (hash === '#privacy' && privacyRef.current) {
        privacyRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [location]);
  
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setSubmitted(false);

      try {
        await axios.post('http://localhost:5001/api/info/contact', formData);
        setSubmitted(true);
      } catch (err) {
        setError('メールの送信中にエラーが発生しました。');
      }
    };

  return (
    <div className={styles.infoPagesFormContainer}>
    <div className={styles.InfoPagesFormImage} />
      {/* アプリ紹介 */}
      <section ref={kakeiboRef} id="kakeibo" className={styles.section_row}>
        <h2>Kakeibo-Appについて</h2>
        <p>「Kakeibo-App」は、<strong>家計簿データを可視化するために作ったアプリ</strong>です。<br />
            手書き用の家計簿帳で日々管理してましたが、PCでも家計簿のデータを管理したいと思い作成しました。</p>
        <p>「Kakeibo-App」で出来ることは以下、<br />1. 家計簿データを登録する。<br />2.家計簿データをリストで表示する。<br />3. 記録した家計簿データを月毎にCSVやPDFファイルを抽出したりできます。</p>
      </section>

      <hr style={{ margin: '40px 0' }} />

      {/* FAQ */}
      <section ref={faqRef} id="faq" className={styles.section_row}>
        <h2>よくある質問</h2>
        <strong>Q：登録した家計簿のデータをグラフで表示できる？</strong>
        <p>A：表示可能です。<br />ホーム画面下部に登録したデータがグラフで反映されます。</p>

        <strong>Q：光熱費を登録する時に、「電気」「ガス」「水道」料金別で集計金額とか表示される？</strong>
        <p>A：表示可能です。<br />ホーム画面中部の「家計簿のデータリストを見る」ボタンをクリックしたらカテゴリー毎の集計データが見れます。</p>

        <strong>Q：ホーム画面に戻る時はどうすれば良い？</strong>
        <p>A：ヘッダー「Kakeibo-App」をクリックするとホーム画面に戻れます。</p>
      </section>

      <hr style={{ margin: '40px 0' }} />

      {/* 運営 */}
      <section ref={policyRef} id="policy" className={styles.section_row}>
        <h2>運営方針</h2>
        <p>管理人が、スキマ時間作って運用と保守作業をしていく予定です。<br />
           アプリ操作中に何かしらの不具合等あれば、問い合わせフォームから連絡頂けますと幸いです。<br />よろしくお願いいたします。</p>
      </section>

      <hr style={{ margin: '40px 0' }} />

      {/* 問い合わせ */}
      <section ref={contactRef} id="contact" className={styles.section_row}>
        <h2>お問い合わせ</h2>
        <p>必要事項をご入力の上、送信してください。</p>

        {submitted && <p className={styles.messageSendSuccess}>お問い合わせを受け付けました。</p>}
        <form onSubmit={handleSubmit} className={styles.contactForm}>
          <div className={styles.contactForm_row}>
            <label htmlFor='name'>
              お名前
              <input type="text" id='name' name="name" value={formData.name} onChange={handleChange} required />
            </label>
          </div>
          <div className={styles.contactForm_row}>
            <label htmlFor='email'>
              メールアドレス
              <input type="email" id='email' name="email" value={formData.email} onChange={handleChange} required />
            </label>
          </div>
          <div className={styles.contactForm_row}>
            <label htmlFor='subject'>
              件名
              <input type="text" id='subject' name="subject" value={formData.subject} onChange={handleChange} required />
            </label>
          </div>
          <div className={styles.contactForm_row}>
            <label htmlFor='message'>
              お問い合わせ内容
              <textarea id='message' name="message" value={formData.message} rows={10} cols={30} onChange={handleChange} required />
            </label>
          </div>
          {error && <p className={styles.valError}>{error}</p>}
          <div className={styles.contactFormBtn}>
            <button type="submit" className={styles.contactForm_btn}>
              <span>送信する</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
                <path stroke="currentColor" strokeWidth="0.8" d="m5.791 3.5 3.709 3H2"></path>
              </svg>
            </button>
          </div>
        </form>
      </section>

      <hr style={{ margin: '40px 0' }} />

      {/* プライバシー */}
      <section ref={privacyRef} id="privacy" className={styles.section_row}>
        <h2>プライバシーポリシー</h2>
        <strong>個人情報の利用目的</strong>
        <p>取得した個人情報は、お問い合わせに対する回答や必要な情報を電子メールなどでご連絡する場合に利用させていただくものであり、個人情報保護法及びこのプライバシーポリシー（個人情報の保護に関する基本方針）に基づき、適切に取り扱い、保護するよう努めてまいります。</p>
        <strong>免責事項</strong>
        <p>当アプリからのリンクやバナーなどで移動したサイトで提供される情報、サービス等については一切の責任を負いません。<br />
           また当アプリのコンテンツ・情報に関しては、できる限り正確な情報を提供するように努めますが、正確性や安全性を保証するものではありません。<br />
           当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。</p>
        <strong>著作権について</strong>
        <p>当アプリで掲載している文章や画像などにつきましては、無断転載禁止です。<br />
           著作権や肖像権に関して問題がございましたら、お問い合わせフォームよりご連絡ください。</p>
        <strong>Cookieの取り扱いに関して</strong>
        <p>当アプリはCookieを取り扱っております。<br />
           Cookieに関して、何か問題がございましたら、お問い合わせフォームよりご連絡ください。</p>
      </section>

    </div>
  );
};

export default InfoPagesForm;