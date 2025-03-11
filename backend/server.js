const express = require('express');
const app = express();
const port = 5001;

app.get('/api', (req, res) => {
  res.send('API is working');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});