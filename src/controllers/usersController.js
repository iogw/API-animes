const db = require('../config/db');
const bcrypt = require('bcrypt');

const query = require('../queries/usersQueries');
const tokenUtils = require('../utils/tokenUtils');
const { jsonRes, MSG } = require('../utils/apiResponse');

const signup = async (req, res) => {
  const MAX_COUNT = 10;
  const { username, email, password } = req.body;
  const passwordHashed = await bcrypt.hash(password, 10);
  let infoForToken = {
    username: username,
    email: email,
    passwordHash: passwordHashed,
  };
  const token = tokenUtils.generate(infoForToken);
  let dbConn;

  try {
    dbConn = await db.getConnection();

    // Checks
    const [[{ db_count }]] = await dbConn.query(query.getTotalCount);
    const [users] = await dbConn.query(query.getUserByEmail, [email]);

    if (db_count >= MAX_COUNT)
      return jsonRes(res, 'badRequest', { error: MSG.MAX_REACHED });
    if (users[0])
      return jsonRes(res, 'badRequest', { error: MSG.ALREADY_REGISTERED });

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
    const [users] = await dbConn.query(query.getUserByEmail, [email]);
    const user = users[0];

    const isUserAndPassOk = !user
      ? false
      : await bcrypt.compare(password, user.password);

    //If FALSE
    if (!isUserAndPassOk) {
      return jsonRes(res, '401', { error: MSG.INVALID_CREDENTIALS });
    }
    //If TRUE
    const infoForToken = {
      username: user.email,
      id: user.id,
    };
    const token = tokenUtils.generate(infoForToken);
    const data = { token: token, username: user.username };
    return jsonRes(res, 'ok', { data: data });
  } catch (error) {
    console.error(error);
    return jsonRes(res, 'internalServerError', { error: error.errno });
  } finally {
    db.endConnection(dbConn);
  }
};

module.exports = { signup, login };
