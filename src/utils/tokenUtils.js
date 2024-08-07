const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const generate = (payload) => {
  const token = jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: '2h',
  });
  return token;
};

const verify = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    return decoded;
  } catch (err) {
    return null;
  }
};

module.exports = { generate, verify };
