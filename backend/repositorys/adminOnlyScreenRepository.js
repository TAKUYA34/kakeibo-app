const User = require('../models/User');
const Transaction = require('../models/Transaction'); // Mongooseモデル

// グラフデータを取得する
const getMonthlySummary = async () => {
  return await Transaction.aggregate([
    {
      $group: {
        _id: { month: { $month: "$trans_date" } },
        totalIncome: {
          $sum: { $cond: [{ $eq: ["$trans_type", "income"] }, "$amount", 0] },
        },
        totalExpense: {
          $sum: { $cond: [{ $eq: ["$trans_type", "expense"] }, "$amount", 0] },
        },
      }
    },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        income: "$totalIncome",
        expense: "$totalExpense",
        difference: { $subtract: ["$totalIncome", "$totalExpense"] }
      }
    },
    { $sort: { month: 1 } }
  ]);
};

// カテゴリデータを取得する
const getCategoryBreakdown = async () => {
  return await Transaction.aggregate([
    { $match: { trans_type: "expense" } },
    {
      $group: {
        _id: "$middle_sel",
        value: { $sum: "$amount" } // $sumは合計を算出する
      }
    },
    {
      $project: {
        _id: 0,
        name: "$_id",
        value: 1
      }
    }
  ]);
};

// ユーザ数の合計を取得する
const getUsersAllCount = async () => {
  return await User.countDocuments();
}

// 今月の取引数を取得する
const getMonthlyTransactionsCount = async () => {

  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setMonth(start.getMonth() + 1);

  return await Transaction.countDocuments({
    trans_date: {$gte: start, $lt: end}
  });
};

// 今月の総支出を取得する
const getSumMonthlyExpenses = async () => {

  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setMonth(start.getMonth() + 1);

  const result = await Transaction.aggregate([
    {
      $match: {
        trans_type: 'expense',
        trans_date: {$gte: start, $lt: end}
      }
    },
    {
      $group: {
        _id: null,
        total: {$sum: '$amount' }
      }
    }
  ]);

  return result[0]?.total || 0;
}


module.exports = {
  getMonthlySummary,
  getCategoryBreakdown,
  getUsersAllCount,
  getMonthlyTransactionsCount,
  getSumMonthlyExpenses
};