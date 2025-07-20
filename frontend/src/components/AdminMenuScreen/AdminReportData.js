import React, { useRef, useEffect, useState } from 'react';
import styles from "../../styles/AdminMenuStatic/AdminReportData.module.css";
import axios from 'axios';

const AdminReportData = () => {

  // useState
  const [title, setTitle] = useState(''); // タイトル
  const [content, setContent] = useState(''); // お知らせ内容
  const [notices, setNotices] = useState([]); // 全てのお知らせ取得用
  const [page, setPage] = useState(1); // 現在のページ
  const [totalPages, setTotalPages] = useState(1);

  const [isEditing, setIsEditing] = useState(false); // 編集モードフラグ
  const [editingId, setEditingId] = useState(null); // 編集

  // token取得
  const adminToken = localStorage.getItem('admin_token');

  // input要素参照
  const inputRef = useRef(null);

  // ページ取得 初回GETのみ
  useEffect(() => {
    fetchNotices(page);

    // 編集ボタンを押下した時、編集formにジャンプする
    if (editingId !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  // ページごとのお知らせデータを取得
  const fetchNotices = async (pageNumber = 1) => {
    try {
      const res = await axios.get(`http://localhost:5001/api/admin/notices/all?page=${pageNumber}&limit=5`, {
        headers: { Authorization: `Bearer ${adminToken}` } // token追加
      });
      console.log(res.data.notices);
      setNotices(res.data.notices);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
    } catch (err) {
      console.error('お知らせの取得に失敗しました', err);
    }
  };

  // 編集するボタンを押したら編集、それ以外は新規投稿する
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      // 更新処理
      try {
        await axios.put(`http://localhost:5001/api/admin/notices/${editingId}`, {
          title,
          content },
          { headers: { Authorization: `Bearer ${adminToken}` } // token追加
        });
        resetForm();
        fetchNotices();
      } catch (err) {
        console.error('更新に失敗しました', err);
      }
    } else {
      // 新規投稿
      try {
        await axios.post('http://localhost:5001/api/admin/notices/register', {
          title,
          content, notice_date: new Date() },
          { headers: { Authorization: `Bearer ${adminToken}` } // token追加
        });
        resetForm();
        fetchNotices();
      } catch (err) {
        console.error('投稿に失敗しました', err);
      }
    }
  };

  // 更新ボタン押した際の処理
  const handleEditClick = (notice) => {
    setIsEditing(true); // 編集フラグON
    setEditingId(notice._id);
    setTitle(notice.title);
    setContent(notice.content);
  };

  // 削除処理
  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm('本当に投稿を削除しますか？');

      if (confirmDelete) {
        await axios.delete(`http://localhost:5001/api/admin/notices/${id}`, {
          headers: { Authorization: `Bearer ${adminToken}` } // token追加
        });
        fetchNotices(); // 再取得
      }
    } catch (err) {
      console.error('削除に失敗しました', err);
    }
  };

  // データリセット
  const resetForm = () => {
    setTitle('');
    setContent('');
    setIsEditing(false);
    setEditingId(null);
  }

  return (
    <main>
      <div className={styles.AdminReportDataContainer}>
        <div className={styles.AdminReportDataImage} />
        <h1>Report Management</h1>

        <form onSubmit={handleSubmit}>
          <div className={styles.reportForm_row}>
            <div className={styles.reportLabel_row}>
              <label htmlFor='title'>タイトル</label>
              <input
                type="text"
                ref={inputRef}
                value={title}
                placeholder='お知らせ'
                onChange={(e) => {
                  console.log('input changed:', e.target.value);
                  setTitle(e.target.value)}}
                required // 入力必須
              />
            </div>
            <div className={styles.reportLabel_row}>
              <label htmlFor='content'>内容</label>
              <textarea
                value={content} placeholder='◯◯の機能を追加しました'
                onChange={(e) => setContent(e.target.value)} rows={8}
                required // 入力必須
              />
            </div>
          </div>
          <div className={styles.report_btn}>
            <button type="submit" className={styles.customize_btn}>
              <span>{isEditing ? '更新する' : '投稿する'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
                <path stroke="currentColor" strokeWidth="0.8" d="m5.791 3.5 3.709 3H2"></path>
              </svg>
            </button>
            {isEditing && (
              <button type="button" className={styles.customize_btn} onClick={resetForm}>
                <span>更新をキャンセルする</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
                  <path stroke="currentColor" strokeWidth="0.8" d="m5.791 3.5 3.709 3H2"></path>
                </svg>
              </button>
            )}
          </div>
        </form><hr />

        <h1>Posted Announcements</h1>
        <div className={styles.content_row}>
          <ul className={styles.notice_list}>
            {notices
              .map((notice) => (
              <li key={notice._id}>
                <strong>{new Date(notice.notice_date).toLocaleDateString()}</strong>
                <strong>{notice.title}</strong>
                <p>{notice.content}</p>
                <div className={styles.reportNotices_btn}>
                  <button onClick={() => handleEditClick(notice)} className={styles.customizeNotices_btn}>
                    <span>編集する</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
                      <path stroke="currentColor" strokeWidth="0.8" d="m5.791 3.5 3.709 3H2"></path>
                    </svg>
                  </button>
                  {editingId !== notice._id && (
                    <button onClick={() => handleDelete(notice._id)} className={styles.customizeNotices_btn}>
                      <span>削除する</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
                        <path stroke="currentColor" strokeWidth="0.8" d="m5.791 3.5 3.709 3H2"></path>
                      </svg>
                    </button>
                  )}
                </div>
              </li> 
              ))}
          </ul>
        </div>

        {/* ページ切り替え */}
        <div className={styles.reportPagesContainer}>
          <p>ページ {page} / {totalPages}</p>
          <div className={styles.reportNoticesPage_btn}>
            <button
              onClick={() => fetchNotices(page - 1)}
              disabled={page === 1} className={styles.customizeNoticesPage_btn}
            > 
              <span>前へ</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
                <path stroke="currentColor" strokeWidth="0.8" d="m5.791 3.5 3.709 3H2"></path>
              </svg>
            </button>
            <button
              onClick={() => fetchNotices(page + 1)}
              disabled={page === totalPages} className={styles.customizeNoticesPage_btn}
            >
              <span>次へ</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
                <path stroke="currentColor" strokeWidth="0.8" d="m5.791 3.5 3.709 3H2"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminReportData;