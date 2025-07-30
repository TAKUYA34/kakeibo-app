// server/server.js
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.BACKEND_PORT || 5001;
const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/my_database';

/* MongoDB接続 */
mongoose.connect(mongoUri).then(() => {
  console.log('MongoDB に接続しました');

    /* サーバー起動 */
  app.listen(PORT, () => {
    console.log(`サーバーがポート ${PORT} で起動しました`);
  });
}).catch((err) => {
  console.error('MongoDB 接続エラー:', err);
});