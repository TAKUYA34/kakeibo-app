const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction'); // Mongooseのモデルをインポート

function mapToTransaction(tx, userId, runTotal) {
  const rawAmount = parseInt(tx.price.replace(/[^\d-]/g, ''), 10); // 数字以外の文字を除去し、整数に変換
  const txAmount = tx.major === 'expense' ? -Math.abs(rawAmount) : Math.abs(rawAmount); // 支出の場合はマイナス、収入の場合はプラスに変換
  const txDate = tx.date ? new Date(tx.date) : new Date(); // 現在の日付を使用

  return new Transaction ({
    transaction_id: uuidv4(), // UUIDを生成
    user_id: new mongoose.Types.ObjectId(userId), // ユーザーIDをObjectIdに変換
    trans_type: tx.major === 'income' ? 'income' : 'expense', // majorがincomeなら収入、expenseなら支出
    amount: txAmount, // 金額を設定
    total_amount: runTotal + txAmount, // 現在の合計金額を計算
    trans_date: txDate,
    major_sel: tx.major, // 大項目を設定
    middle_sel: tx.middle, // 中項目を設定
    minor_sel: tx.minor || '', // 小項目を設定（未指定の場合は空文字）
    memo: tx.memo || '', // メモを設定（未指定の場合は空文字）
    created_at: txDate, // 作成日時を現在の日付に設定
    updated_at: txDate // 更新日時を現在の日付に設定
  });
}

module.exports = {
  mapToTransaction
};