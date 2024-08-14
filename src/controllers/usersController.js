const db = require('../config/db');
const bcrypt = require('bcrypt');

const query = require('../queries/usersQueries');
const tokenUtils = require('../utils/tokenUtils');
const { jsonRes, MSG } = require('../utils/apiResponse');

const signup = async (req, res) => {
  const MAX_COUNT = 10;
  const { username, email, password } = req.body;
  const passwordHashed = await bcrypt.hash(password, 10);
  let payload = {
    username: username,
    email: email,
  };
  const token = tokenUtils.generate(payload);
  let dbConn;

  try {
    dbConn = await db.getConnection();

    // Checks
    const [[{ db_count }]] = await dbConn.query(query.getTotalCount);
    const [users] = await dbConn.query(query.getUserByEmail, [email]);

    if (users[0])
      return jsonRes(res, 'badRequest', { error: MSG.ALREADY_REGISTERED });
    if (db_count >= MAX_COUNT)
      return jsonRes(res, 'badRequest', { error: MSG.MAX_REACHED });

    // Add user
    const [newUser] = await dbConn.query(query.addUser, [
      username,
      email,
      passwordHashed,
    ]);

    const data = { token: token, id: newUser.insertId };
    return jsonRes(res, 'ok', { data: data });
  } catch (error) {
    console.error(error);
    return jsonRes(res, 'internalServerError', { error: error.errno });
  } finally {
    db.endConnection(dbConn);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  let dbConn;

  try {
    dbConn = await db.getConnection();
    const [dbUsers] = await dbConn.query(query.getUserByEmail, [email]);
    const dbUser = dbUsers[0];

    // Checks
    const isUserAndPassOk = !dbUser
      ? false
      : await bcrypt.compare(password, dbUser.password);
    if (!isUserAndPassOk) {
      return jsonRes(res, 'unauthorized', { error: MSG.INVALID_CREDENTIALS });
    }

    // Login
    const payload = {
      id: dbUser.id,
      username: dbUser.username,
    };
    const token = tokenUtils.generate(payload);
    const data = { token: token, username: dbUser.username };
    return jsonRes(res, 'ok', { data: data });
  } catch (error) {
    console.error(error);
    return jsonRes(res, 'internalServerError', { error: error.errno });
  } finally {
    db.endConnection(dbConn);
  }
};

module.exports = { signup, login };
