// middleware/auth_situation.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization']; 
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // トークンの検証
    req.user = decoded; // { email, id } 
    next();
  } catch (err) {
    return res.sendStatus(403); // トークンが無効または期限切れ
  }
};

module.exports = authenticate;