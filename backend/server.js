require('dotenv').config(); // .envファイルを読み込む

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5001;

// MONGO_URIをログに出力する
const MONGO_URI = process.env.MONGO_URI;
console.log("Connecting to MongoDB at:", MONGO_URI);

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Cannnot connect to MongoDB:', err));

app.get('/', (req, res) => {
  res.send('API is working');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});