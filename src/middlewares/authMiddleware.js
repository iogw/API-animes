const { verify } = require('../utils/tokenUtils');

const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }
  const decoded = verify(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  req.user = decoded;
  next();
};

module.exports = { authenticate };
