const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 5001;

// MONGO_URIをログに出力する
const MONGO_URI = "mongodb://mongo:27017/mern"
console.log("Connecting to MongoDB at:", MONGO_URI);

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Cannnot connect to MongoDB:', err));

app.get('/', (req, res) => {
  res.send('API is working');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});