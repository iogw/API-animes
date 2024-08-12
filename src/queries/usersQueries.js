const getTotalCount = 'SELECT COUNT(*) AS db_count FROM users;';

const getUserByEmail = 'SELECT * FROM users WHERE email = ?;';
const addUser = 'INSERT INTO users (username,email,password) VALUES (?,?,?)';

module.exports = { getTotalCount, getUserByEmail, addUser };
