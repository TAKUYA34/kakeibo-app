function mapTestTransactionToExpectedFormat(testTx) {

  return {
    date: testTx.date,
    type: testTx.trans_type,
    major: testTx.major_sel,
    middle: testTx.middle_sel,
    minor: testTx.minor_sel,
    price: String(testTx.amount),
    amount: testTx.amount,
    trans_date: testTx.trans_date,
    memo: testTx.memo
  };
}

module.exports = {
  mapTestTransactionToExpectedFormat
}