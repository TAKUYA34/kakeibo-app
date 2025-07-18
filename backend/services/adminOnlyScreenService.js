const adminOnlyScreenRepository = require('../repositorys/adminOnlyScreenRepository');

// 中項目データ
const middleSelNameMap = {
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
  salary: '給料',
  bonus: 'ボーナス',
  other: 'その他'
};

// 棒グラフと円グラフの各データを取得する
const fetchUserAllSelectData = async () => {
  const monthly = await adminOnlyScreenRepository.getMonthlySummary();
  const categoryRaw = await adminOnlyScreenRepository.getCategoryBreakdown();

  // categoryRaw の name を日本語に変換
  const category = categoryRaw.map(item => ({
    ...item,
    name: middleSelNameMap[item.name] || item.name // マッピングがなければ元の名前を使う
  }));

  return {
    monthlyData: monthly,
    categoryData: category
  };
};

// Userの統計データを取得する
const getUserAllStatsData = async () => {
  const [userCount, transactionCount, monthlyExpense] = await Promise.all([
    adminOnlyScreenRepository.getUsersAllCount(), // 総ユーザー数
    adminOnlyScreenRepository.getMonthlyTransactionsCount(), // 総取引数
    adminOnlyScreenRepository.getSumMonthlyExpenses() // 総支出額
  ]);

  // データが空ならダミーを返す
  if (userCount === 0 && transactionCount === 0 && monthlyExpense === 0) {
    return {
      totalUsers: 120,
      monthlyTransactions: 3250,
      monthlyExpense: 110000
    }
  }

  return {
    totalUsers: userCount,
    monthlyTransactions: transactionCount,
    monthlyExpense: monthlyExpense

  }
}
module.exports = {
  fetchUserAllSelectData,
  getUserAllStatsData
};