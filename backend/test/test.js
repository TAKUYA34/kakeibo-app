// test-bcrypt.js
const bcrypt = require("bcrypt");

async function main() {
  const plainPassword = "kyoko_set";

  // 登録処理（保存）
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  console.log("保存するハッシュ:", hashedPassword);

  // ログイン処理（比較）
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  console.log("照合結果:", isMatch); // ← true になるはず
}

main();