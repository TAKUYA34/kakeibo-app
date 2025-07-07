const transactionAddService = require('../services/transactionAddService');

async function handleTransactionAdd(req, res) {
  try {
    console.log('リクエスト受信:', req.body);
    const { transactions, userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'ユーザーIDが見つかりません。' });
    }

    const { initialTotal, saved } = await transactionAddService.toAddUserTransactions(transactions, userId); // トランザクションを追加するサービスを呼び出す
    res.status(200).json({ message: '登録成功しました！', initialTotal, transactions: saved });

  } catch (error) {
    console.error('[handleTransactionAdd] Error:', error);
    res.status(500).json({
    message: '登録に失敗しました。',
    error: error.message || '不明なエラー'
  });
  }
}

module.exports = {
  handleTransactionAdd
};