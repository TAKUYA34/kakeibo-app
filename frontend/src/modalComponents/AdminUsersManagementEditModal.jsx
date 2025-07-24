import styles from '../styles/AdminMenuStatic/AdminUsersManagementEditModal.module.css';

const AdminUsersManagementEditModal = ({
  editForm,
  handleEditChange,
  handleUpdate,
  editingUser,
  setEditingUser
  }) => {
    if (!editingUser) {
      return null;
    }

  return (
    <div className={styles.modalOverlayContainer}>
      <div className={styles.modalContent}>
        <h2>ユーザー情報を編集</h2>
        <label>ユーザー名</label>
        <input
          type="text"
          name="user_name"
          value={editForm.user_name}
          onChange={handleEditChange}
        /><br />
        <label>メールアドレス</label>
        <input
          type="email"
          name="email"
          value={editForm.email}
          onChange={handleEditChange}
        /><br />
        <label>権限</label>
        <select name="role" value={editForm.role} onChange={handleEditChange}>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>

        <div className={styles.editUpdateUser_row}>
          <button onClick={handleUpdate} className={styles.updateUserCustomize_btn}>
            <span>更新する</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
              <path stroke="currentColor" strokeWidth="0.8" d="m5.791 3.5 3.709 3H2"></path>
            </svg>
          </button>
          <button onClick={() => setEditingUser(null)} className={styles.updateUserCustomize_btn}>
            <span>キャンセル</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
              <path stroke="currentColor" strokeWidth="0.8" d="m5.791 3.5 3.709 3H2"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersManagementEditModal;