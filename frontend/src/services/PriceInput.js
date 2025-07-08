import React, { useState } from "react";

const PriceInput = ({ onChange, className, error }) => {
  const [displayVal, setDisplayVal] = useState("");

  // 入力時の処理（数字のみ）
  const handleChange = (e) => {
    const input = e.target.value;
    // 数字のみを許可
    const numericValue = input.replace(/[^\d]/g, "");
    const formattedValue = Number(numericValue).toLocaleString();
    setDisplayVal(formattedValue); // 表示用の値を更新
    onChange(formattedValue); // 外部に渡す
  };

  // フォーカス時、カンマや円を除去して編集しやすくする
  const handleFocus = () => {
    const rawValue = displayVal.replace(/円/g, ""); // カンマ・円を除去
    setDisplayVal(rawValue);
  };

  // フォーカスを外した際、’円’を自動で付与する
  const handleBlur = () => {
    if ( displayVal !== "" && !displayVal.endsWith("円")) {
      // 数字が入力されていて、最後に円が付いていない場合
      setDisplayVal(`${displayVal}円`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <label className={className}>金額</label>
      <input
        type="text"
        value={displayVal}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        name="amount"
        placeholder="例: 1000円"
      />
      {error && <div style={{ color: 'red', marginTop: '8px' }}>{error}</div>}
    </div>
  );
};

export default PriceInput;
