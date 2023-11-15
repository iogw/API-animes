//IMPORT NPM REQUIRED
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

//AUTENTICATION AND AUTHORITATION
const generateToken = (payload) => {
  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '2h' });
  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded;
  } catch (err) {
    return null;
  }
};
// Authoritation middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  req.user = decoded;
  next();
};
//CREATE & CONFIG SERVER
const server = express();
server.use(cors());
server.use(express.json());

// SERVER PORT
const serverPort = 3113;
server.listen(serverPort, () =>
  console.log(`Server listening at http://localhost:${serverPort}`)
);

async function getConnection() {
  const connection = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DBUSER,
    password: process.env.PASS,
    database: process.env.DATABASE,
  });
  await connection.connect();

  console.log(
    `Database connection established (identifier=${connection.threadId})`
  );
  return connection;
}

//to input year validations
const maxYear = new Date().getFullYear() + 2;

//Endpoint to list all animes
server.get('/animes', async (req, res) => {
  const queryAllAnimes = 'SELECT * FROM animes';

  console.log('Querying database');
  try {
    const conn = await getConnection();
    const [results] = await conn.query(queryAllAnimes);

    const numOfElements = results.length;

    res.json({
      success: true,
      info: { count: numOfElements },
      results: results,
    });
    conn.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'database error',
    });
  }
});

//Endpoint to list one anime
server.get('/animes/:idAnime', async (req, res) => {
  const paramsId = req.params.idAnime;
  console.log(paramsId);
  //input validation
  if (isNaN(parseInt(paramsId))) {
    return res.status(400).json({
      success: false,
      error: 'id must be a number',
    });
  }
  const queryIdAnime = `SELECT * FROM animes WHERE idAnime = ?;`;

  console.log('Querying database');
  try {
    const conn = await getConnection();
    const [animes] = await conn.query(queryIdAnime, [paramsId]);
    const anime = animes[0];
    conn.end();
    if (animes.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'anime not found',
      });
    }
    res.json({
      success: true,
      results: anime,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'database error',
    });
  }
});
//Endpoint to insert data in animes table
server.post('/animes', authenticateToken, async (req, res) => {
  const { title, year, chapters } = req.body;

  //input validation
  if (!title || !year || !chapters) {
    return res.status(400).json({
      success: false,
      error: 'title, year and chapters are required fields',
    });
  }
  if (typeof title !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'title must be text',
    });
  }
  if (isNaN(parseInt(year)) || isNaN(parseInt(chapters))) {
    return res.status(400).json({
      success: false,
      error: 'year and chapters must be numbers',
    });
  }
  if (!(1900 < parseInt(year) && parseInt(year) < maxYear)) {
    return res.status(400).json({
      success: false,
      error: `year must be after 1900 and before ${maxYear}`,
    });
  }

  const insertAnime =
    'INSERT INTO animes (title, year, chapters) VALUES (?, ?, ?);';
  const queryCheckIfTitleExists = 'SELECT * FROM animes WHERE title = ?';

  console.log('Sending data to database');
  try {
    const conn = await getConnection();
    //check if the title already exists
    const [animeByTitle] = await conn.query(queryCheckIfTitleExists, [title]);
    if (animeByTitle.length !== 0) {
      conn.end();
      return res.status(400).json({
        success: false,
        error: 'This title already exists',
      });
    }
    const [resultAnime] = await conn.query(insertAnime, [
      title,
      year,
      chapters,
    ]);
    conn.end();
    res.status(200).json({
      success: true,
      idNewAnime: resultAnime.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'database error',
    });
  }
});

//Endpoint to update an anime
/* Example
  ​http://localhost:3113/animes/14
  {
  "title": "Kaze no Stigma",
  "year": "2023",
  "chapters": "10"
} */
server.put('/animes/:animeId', authenticateToken, async (req, res) => {
  const paramsId = req.params.animeId;
  const { title, year, chapters } = req.body;

  //input validation
  if (isNaN(parseInt(paramsId))) {
    return res.status(400).json({
      success: false,
      error: 'id must be a number',
    });
  }
  if (!title || !year || !chapters) {
    return res.status(400).json({
      success: false,
      error: 'title, year and chapters are required fields',
    });
  }
  if (typeof title !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'title must be text',
    });
  }
  if (isNaN(parseInt(year)) || isNaN(parseInt(chapters))) {
    return res.status(400).json({
      success: false,
      error: 'year and chapters must be numbers',
    });
  }
  if (!(1900 < parseInt(year) && parseInt(year) < maxYear)) {
    return res.status(400).json({
      success: false,
      error: `year must be after 1900 and before ${maxYear}`,
    });
  }

  //Check if anime exists in db by id
  console.log('Checking if anime existes');

  const queryIfAnimeExists = `SELECT * FROM animes WHERE idAnime = ${paramsId};`;
  const queryToModifyAnime =
    'UPDATE animes SET title = ?, year = ?, chapters = ? WHERE idAnime = ?;';
  try {
    const conn = await getConnection();
    // Get data to check if exists and to send in response
    const [animesSearch] = await conn.query(queryIfAnimeExists);
    //doesnt exist:
    if (animesSearch.length === 0) {
      conn.end();
      return res.status(404).json({
        success: false,
        error: 'anime not found',
      });
    }
    //Exists: send data to modify in db
    console.log('Sending data to database');
    const [modifyAnime] = await conn.query(queryToModifyAnime, [
      title,
      year,
      chapters,
      paramsId,
    ]);
    //Get new data to send in response
    const [animesModified] = await conn.query(queryIfAnimeExists);
    conn.end();

    res.status(200).json({
      success: true,
      msg: 'data modified successfully',
      'previous data': animesSearch[0],
      'new data': animesModified[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'database error',
    });
  }
});

//Endpoint to delete anime
/* Example 
  ​http://localhost:3113/animes/14
*/
server.delete('/animes/:animeId', authenticateToken, async (req, res) => {
  console.log('Querying database');
  const paramsId = req.params.animeId;
  if (isNaN(parseInt(paramsId))) {
    return res.status(400).json({
      success: false,
      error: 'id must be a number',
    });
  }

  const queryIfAnimeExists = `SELECT * FROM animes WHERE idAnime = ?;`;
  try {
    const conn = await getConnection();
    const [animes] = await conn.query(queryIfAnimeExists, [paramsId]);
    if (animes.length === 0) {
      conn.end();
      return res.status(404).json({
        success: false,
        error: 'anime not found',
      });
    }
    const queryDeleteAnime = 'DELETE FROM animes WHERE idAnime = ?;';
    const [animeDeleted] = await conn.query(queryDeleteAnime, [paramsId]);
    conn.end();

    res.status(200).json({
      success: true,
      msg: `anime "${animes[0].title}" deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'database error',
    });
  }
});

//Endpoint user registration
/* Example
  ​http://localhost:3113/signup/
  {
  "username": "Irene",
  "email": "irene@gmail.com",
  "password": "12345"
} */
server.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  //input validation
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      error: 'username, email and password are required fields',
    });
  }
  if (!(email.includes('@') && email.includes('.'))) {
    return res.status(400).json({
      success: false,
      error: 'email format incorrect',
    });
  }
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      error: 'password must be at least 8 characters long',
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  //check if email already exists
  const queryCheckIfEmailIsInDb = 'SELECT * FROM users WHERE email = ?;';

  try {
    const conn = await getConnection();
    const [user] = await conn.query(queryCheckIfEmailIsInDb, [email]);
    // If already exists
    if (user[0]) {
      conn.end();
      return res.json({
        success: false,
        error: 'email already registered',
      });
    }
    // If not: create token, add user to db and response ok+token
    const queryAddUser =
      'INSERT INTO users (username,email,password) VALUES (?,?,?)';

    let infoForToken = {
      username: username,
      email: email,
      passwordHash: passwordHash,
    };
    const token = generateToken(infoForToken);

    const [newUser] = await conn.query(queryAddUser, [
      username,
      email,
      passwordHash,
    ]);
    conn.end();
    res.json({ success: true, token: token, id: newUser.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'database error',
    });
  }
});

//Endpoint login
/* Example
  ​http://localhost:3113/login/
  {
  "email": "irene@gmail.com",
  "password": "12345"
} */
server.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'email and password are required fields',
    });
  }
  if (!(email.includes('@') && email.includes('.'))) {
    return res.status(400).json({
      success: false,
      error: 'email format incorrect',
    });
  }

  //Check if user exists
  const querySearchUser = 'SELECT * FROM users WHERE email = ?;';
  try {
    const conn = await getConnection();
    const [users] = await conn.query(querySearchUser, [email]);
    conn.end();

    const user = users[0];
    //Check if user exists and pass is correct (bcrypt.compare)
    const userAndPassOk = !user
      ? false
      : await bcrypt.compare(password, user.password);
    //If not exists or pass wrong
    if (!userAndPassOk) {
      return res
        .status(401)
        .json({ success: false, errorMessage: 'Invalid credentials' });
    }
    //If exists
    const infoForToken = {
      username: user.email,
      id: user.id,
    };
    const token = generateToken(infoForToken);
    return res.status(200).json({
      success: true,
      token,
      username: user.username,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'database error',
    });
  }
});

module.exports = server;
