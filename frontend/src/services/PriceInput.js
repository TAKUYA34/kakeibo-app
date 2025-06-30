import React, {useState} from "react";

const PriceInput = () => {
  const [amount, setAmount] = useState("");

  // 入力時の処理（数字のみ）
  const handleChange = (e) => {
    const value = e.target.value;
    // 数字のみを許可
    const numericValue = value.replace(/[^\d]/g, "");
    setAmount(numericValue);
  };

  // フォーカスを外した際、’円’を自動で付与する
  const handleBlur = () => {
    if ( amount !== "" && !amount.endsWith("円")) {
      // 数字が入力されていて、最後に円が付いていない場合
      setAmount(`${amount}円`);
    }
  };

  const handleFocus = () => {
    setAmount(amount.replace("円", ""));
  };

  return (
    <div>
      <label>金額：</label>
      <input
        type="text"
        value={amount}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        name="amount"
      />
      <br />
    </div>
  );
};

export default PriceInput;
