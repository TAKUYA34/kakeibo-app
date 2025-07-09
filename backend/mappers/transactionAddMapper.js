const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction'); // Mongooseのモデルをインポート

// 日付文字列を受け取って、時間・秒がなければ追加してDateオブジェクトに変換
function parseDateTimeAndSecond(dateStr) {
  if (!dateStr) return new Date();

  if (dateStr.includes('T')) {
    return new Date(dateStr);
  }
  // 日付のみの場合
  const baseDate = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  baseDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
  
  return baseDate;
}

// モデルにマッピング
function mapToTransaction(tx, userId, runTotal) {
  const rawAmount = parseInt(tx.price.replace(/[^\d-]/g, ''), 10); // 数字以外の文字を除去し、整数に変換
  const txAmount = tx.major === 'expense' ? -Math.abs(rawAmount) : Math.abs(rawAmount); // 支出ならマイナス、収入ならプラス
  const txDate = parseDateTimeAndSecond(tx.date); // 日付をパース（時間・秒も対応）

  return new Transaction({
    transaction_id: uuidv4(), // UUIDを生成
    user_id: new mongoose.Types.ObjectId(userId), // ユーザーIDをObjectIdに変換
    trans_type: tx.major === 'income' ? 'income' : 'expense', // majorがincomeなら収入、expenseなら支出
    amount: txAmount, // 金額を設定
    total_amount: runTotal + txAmount, // 現在の合計金額を計算
    trans_date: txDate, // 指定日付
    major_sel: tx.major, // 大項目を設定
    middle_sel: tx.middle, // 中項目を設定
    minor_sel: tx.minor || '', // 小項目を設定（未指定の場合は空文字）
    memo: tx.memo || '', // メモを設定（未指定の場合は空文字）
    created_at: new Date(), // 作成日時を現在の日付に設定
  });
}

module.exports = {
  mapToTransaction
};