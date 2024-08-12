const db = require('../config/db');
const bcrypt = require('bcrypt');

const tokenUtils = require('../utils/tokenUtils');
const query = require('../queries/usersQueries');

const jsonRes = require('../utils/apiResponse');
const errorMsgEmailRegistered = 'This email is already registered';

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  let dbConn;

  try {
    dbConn = await db.getConnection();
    const [users] = await conn.query(query.getUserByEmail, [email]);

    if (users[0]) {
      return jsonRes(res, 'badRequest', { error: errorMsgEmailRegistered });
      // return res.json({
      //   success: false,
      //   error: 'email already registered',
      // });
    }

    let infoForToken = {
      username: username,
      email: email,
      passwordHash: passwordHash,
    };
    const token = tokenUtils.generate(infoForToken);

    const [newUser] = await dbConn.query(query.addUser, [
      username,
      email,
      passwordHash,
    ]);

    const data = { token: token, id: newUser.insertId };

    return jsonRes(res, 'ok', { data: data });
    // res.status(200).json({ success: true, token: token, id: newUser.insertId });
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
    const [users] = await conn.query(query.getUserByEmail, [email]);
    const user = users[0];

    //Check if email exists and pass is correct
    const isUserAndPassOk = !user
      ? false
      : await bcrypt.compare(password, user.password);

    //If FALSE
    if (!isUserAndPassOk) {
      return jsonRes(res, '401');
      //   return res
      //     .status(401)
      //     .json({ success: false, errorMessage: 'Invalid credentials' });
    }
    //If TRUE
    const infoForToken = {
      username: user.email,
      id: user.id,
    };
    const token = tokenUtils.generate(infoForToken);
    const data = { token: token, username: user.username };
    return jsonRes(res, 'ok', { data: data });
    // return res.status(200).json({
    //   success: true,
    //   token,
    //   username: user.username,
    // });
  } catch (error) {
    console.error(error);
    return jsonRes(res, 'internalServerError', { error: error.errno });
  } finally {
    db.endConnection(dbConn);
  }
};

module.exports = { signup, login };
