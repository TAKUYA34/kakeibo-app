/* AdminUsersManagementData.js */
import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../services/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
import axios from 'axios';
import styles from '../../styles/AdminMenuStatic/AdminUsersManagementData.module.css';
import AdminUsersManagementEditModal from '../../modalComponents/AdminUsersManagementEditModal';

const AdminUsersManagementData = () => {
  // useState
  const { adminUser, loading } = useAdminAuth();
  const [ users, setUsers ] = useState([]);

  // 検索
  const [ searchTerm, setSearchTerm ] = useState('');

  // 編集
  const [ editingUser, setEditingUser ] = useState(null);
  const [ editForm, setEditForm ] = useState({ user_name: '', email: '', role: '' });
  
  // navigate 初期化
  const navigate = useNavigate();

  useEffect(() => {
    // tokenが切れたらloginページへ
    if (!adminUser && !loading) {
      navigate('/admin/login');
    } else {
      fetchAllUsers();
    }
  }, [adminUser, loading]);

    /* 全取引一覧 */
  const fetchAllUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/admin/home/users', {
        withCredentials: true
      });
      setUsers(res.data);
    } catch (err) {
      console.error('全取引取得エラー', err);
    }
  };

  /* ユーザー名検索 */
  const fetchUsersByName = async (name) => {
    try {
      const res = await axios.post(`http://localhost:5001/api/admin/home/users/search`, { name },
        {
          withCredentials: true
        }
      );
      setUsers(res.data); // 結果を表示
    } catch (err) {
      console.error('ユーザー検索エラー', err);
    }
  };

  /* 検索ボタン押下時 */
  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      fetchAllUsers(); // 空なら全件取得
    } else {
      fetchUsersByName(searchTerm);
    }
  };

  /* 編集モーダル画面を開く */
  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditForm({
      user_name: user.user_name,
      email: user.email,
      role: user.role
    });
  };

  /* 編集モーダル画面でフォーム変更 */
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }

  /* 更新ボタン押下時 */
  const handleUpdate = async () => {
    try {
      const res = await axios.put(`http://localhost:5001/api/admin/home/users/edit/${editingUser._id}`, editForm, {
        withCredentials: true
      });

      const updatedUser = res.data.user;

      setUsers((prev) =>
        prev.map((user) => (user._id === updatedUser._id ? updatedUser : user))
      );
      setEditingUser(null);
    } catch (err) {
      console.error('更新エラー', err);
    }
  };

  /* 削除ボタン押下時 */
  const handleDelete = async (userId, userName) => {
    const confirmDelete = window.confirm(`${userName}さんを削除しますか？`);

    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5001/api/admin/home/users/delete/${userId}`, {
          withCredentials: true
        });
        
        setUsers((prev) => prev.filter((user) => user._id !== userId));
      } catch (err) {
        console.error('削除エラー', err);
      }
    }
  };

  return (
    <main>
      <div className={styles.AdminUsersManagementDataContainer}>
        <div className={styles.AdminUsersManagementDataImage} />
        <h1>Users Management</h1>

        <div className={styles.UsersSearch_row}>
          <label htmlFor="userSearch">ユーザーを検索する</label>
          <input
            id="userSearch"
            type="text"
            value={searchTerm}
            placeholder="ユーザー名を入力してください"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className={styles.userSearchSelectBtn}>
            <button onClick={handleSearch} className={styles.searchUserCustomize_btn}>
              <span>検索する</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
                <path stroke="currentColor" strokeWidth="0.8" d="m5.791 3.5 3.709 3H2"></path>
              </svg>
            </button>
          </div>
        </div>
        <div className={styles.usersTable_row}>
          <table className={styles.usersTableContainer}>
            <thead>
              <tr>
                <th>ユーザー名</th>
                <th>メールアドレス</th>
                <th>権限</th>
                <th>ログイン状態</th>
                <th>編集</th>
                <th>削除</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter(user => user !== null && user !== undefined)
                .map((user) => (
                <tr key={user._id}>
                  <td>{user.user_name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.is_logged_in ? 'ログイン中' : '未ログイン'}</td>
                  <td>
                    <div className={styles.editUser_row}>
                      <button onClick={() => handleEditClick(user)} className={styles.editUserCustomize_btn}>
                        <span>編集する</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
                          <path stroke="currentColor" strokeWidth="0.8" d="m5.791 3.5 3.709 3H2"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className={styles.deleteUser_row}>
                      <button onClick={() => handleDelete(user._id, user.user_name)} className={styles.deleteUserCustomize_btn}>
                        <span>削除する</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
                          <path stroke="currentColor" strokeWidth="0.8" d="m5.791 3.5 3.709 3H2"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* モーダル画面 */}
          {editingUser && (
            <AdminUsersManagementEditModal
              editForm={editForm}
              handleEditChange={handleEditChange}
              handleUpdate={handleUpdate}
              editingUser={editingUser}
              setEditingUser={setEditingUser}
            />
          )}
        </div>
      </div>
    </main>
  )
}

export default AdminUsersManagementData;