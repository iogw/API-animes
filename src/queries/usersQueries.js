const getUserByEmail = 'SELECT * FROM users WHERE email = ?;';
const addUser =
  'INSERT INTO users (username,email,password) VALUES (?,?,?)';

module.exports = { getUserByEmail, addUser };
