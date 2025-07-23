// 編集用モーダルコンポーネント
import { useState } from "react";
import styles from "../styles/AdminMenuStatic/AdminDashboardEditModal.module.css";

export default function EditModal({ transaction, onClose, onSave }) {

  // useState
  const [formValues, setFormValues] = useState({ ...transaction, user_id: transaction.user_id });

    // en → jaに変更（編集画面用）
  const majorItemsENToJA = {
    income: '収支',
    expense: '支出'
  };

  // en → jaに変更（編集画面用）支出を選択した場合
  const middleItemsExpenseENToJA = {
    utility: '光熱費',
    rent: '家賃',
    food: '食費',
    dailyNecessities: '日用品費',
    education: '教育費',
    transportation: '交通費',
    beauty: '美容費',
    gasoline: 'ガソリン費',
    communication: '通信費',
    medicalCare: '医療費',
    insurance: '保険費',
    diningOut: '外食費',
    entertainment: '娯楽費',
    hobby: '趣味費',
    special: '特別費',
    other: 'その他'
  };

  // en → jaに変更（編集画面用）収支を選択した場合
  const middleItemsIncomeENToJA = {
    salary: '給料',
    bonus: 'ボーナス'
  }

  // en → jaに変更（編集画面用）
  const minorItems = {
    rent: ['住宅ローン'],
    utility: ['電気', 'ガス', '水道'],
    food: ['食料品', 'おやつ', '飲み会'],
    dailyNecessities: ['雑貨', '衣類', '家具'],
    education: ['塾', '習い事'],
    transportation: ['公共交通', 'タクシー', '通勤', '個人'],
    beauty: ['美容院', 'ネイル', '整形'],
    gasoline: ['通勤', '個人'],
    communication: ['携帯', 'WI-FI', 'データ購入'],
    medicalCare: ['精神科', '歯科', '内科', '整体', '消化器科', '皮膚科', '呼吸器内科', '健康診断', '薬'],
    insurance: ['生命保険', '医療保険', 'がん保険', '自動車保険', '火災保険'],
    entertainment: ['冠婚葬祭', 'レジャー施設', '交通費', '温泉']
  }


  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormValues((prev) => {
      const updated = { ...prev, [name]: value };

      // major_sel が変わったら middle_sel, minor_sel を初期化
      if (name === "major_sel") {
        updated.middle_sel = "";
        updated.minor_sel = "";
      }

      // middle_sel が変わったら minor_sel を初期化
      if (name === "middle_sel") {
        updated.minor_sel = "";
      }

      return updated;
    });
  };

  const handleSubmit = () => {
    onSave(formValues); // PUTで保存
    onClose(); // モーダル画面を閉じる
  };

  // 中項目候補を取得
  const getMiddleItems = () => {
    return formValues.major_sel === 'expense'
      ? Object.entries(middleItemsExpenseENToJA)
      : Object.entries(middleItemsIncomeENToJA);
  };

  // 小項目候補を取得
  const getMinorItems = () => {
    return minorItems[formValues.middle_sel] || [];
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>取引の編集</h2>
        <label>大項目</label>
        <select name="major_sel" value={formValues.major_sel} onChange={handleChange}>
          {Object.entries(majorItemsENToJA).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <label>中項目</label>
        <select name="middle_sel" value={formValues.middle_sel} onChange={handleChange}>
          <option value="">--選択してください--</option>
          {getMiddleItems().map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <label>小項目</label>
        <select name="minor_sel" value={formValues.minor_sel} onChange={handleChange}>
          <option value="">--選択してください--</option>
          {getMinorItems().map((item, index) => (
            <option key={index} value={item}>{item}</option>
          ))}
        </select>
        
        <label>金額</label>
        <input
          name="amount"
          value={formValues.amount}
          onChange={handleChange}
        />
        <label>メモ</label>
        <input
          name="memo"
          value={formValues.memo}
          onChange={handleChange}
        />

        <div className={styles.modalActionsBtn}>
          <button onClick={handleSubmit}>保存</button>
          <button onClick={onClose}>キャンセル</button>
        </div>
      </div>
    </div>
  );
}
