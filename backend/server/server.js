// server/server.js
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.BACKEND_PORT || 5001;

// docker設定用
// const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/production_db';
  const mongoUri = 'mongodb://host.docker.internal:27017/my_database';

// local設定用
// const mongoUri = process.env.LOCAL_MONGO_URI || 'mongodb://localhost:27017/production_db';

/* MongoDB接続 */
mongoose.connect(mongoUri).then(() => {
  // console.log('MongoDB に接続しました');

    /* サーバー起動 */
  app.listen(PORT, () => {
    console.log(`サーバーがポート ${PORT} で起動しました`);
  });
}).catch((err) => {
  console.error('MongoDB 接続エラー:', err);
});