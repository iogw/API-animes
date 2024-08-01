//IMPORT NPM REQUIRED
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

//AUTENTICATION AND AUTHORITATION
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const generateToken = (payload) => {
  const token = jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: '2h',
  });
  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
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
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
  const querySelectAllAnimes = 'SELECT * FROM animes';

  console.log('Querying database');
  try {
    const conn = await getConnection();
    const [results] = await conn.query(querySelectAllAnimes);

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

// Endpoint to insert data in animes table
server.post('/animes', authenticateToken, async (req, res) => {
  const { title, year, chapters } = req.body;

  // INPUT VALIDATION

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

  const MAX_ANIME_COUNT = 11;
  const queryCountAllAnimes = 'SELECT COUNT(*) AS total_of_animes FROM animes;';
  const querySelectByTitle = 'SELECT * FROM animes WHERE title = ?';
  const queryInsertAnime =
    'INSERT INTO animes (title, year, chapters) VALUES (?, ?, ?);';

  console.log('Sending data to database');
  try {
    const conn = await getConnection();

    // Check total animes in db
    const [[{ total_of_animes }]] = await conn.query(queryCountAllAnimes);

    if (total_of_animes >= MAX_ANIME_COUNT) {
      conn.end();
      console.log('Conection ended');

      return res.status(400).json({
        success: false,
        error: 'The maximum number of anime to register has been reached',
      });
    }

    // Check if title already exists
    const [animeByTitle] = await conn.query(querySelectByTitle, [title]);
    if (animeByTitle.length !== 0) {
      conn.end();
      console.log('Conection ended');

      return res.status(400).json({
        success: false,
        error: 'This title already exists',
      });
    }

    // Insert new data
    const [resultAnime] = await conn.query(queryInsertAnime, [
      title,
      year,
      chapters,
    ]);

    conn.end();
    console.log('Conection ended');

    return res.status(200).json({
      success: true,
      message: 'Anime created',
      idNewAnime: resultAnime.insertId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'database error',
    });
  }
});

//Endpoint to update an anime
/* Example
  ​http://localhost:3113/animes/4
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
  console.log('Checking if id exists');

  const queryIfIdExists = `SELECT * FROM animes WHERE idAnime = ?;`;
  const queryIfTitleExists = `SELECT * FROM animes WHERE title = ?;`;
  const queryToModifyAnime =
    'UPDATE animes SET title = ?, year = ?, chapters = ? WHERE idAnime = ?;';
  try {
    const conn = await getConnection();
    // Get data to check if id/title exists and to send in response
    const [animesIdSearch] = await conn.query(queryIfIdExists, [paramsId]);
    //doesnt exist:
    if (animesIdSearch.length === 0) {
      conn.end();
      return res.status(404).json({
        success: false,
        error: 'anime not found',
      });
    }

    const [animeTitleSearch] = await conn.query(queryIfTitleExists, [title]);
    //doesnt exist:
    if (animeTitleSearch.length !== 0) {
      conn.end();
      return res.status(400).json({
        success: false,
        error: 'this title already exists',
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
    const [animesModified] = await conn.query(queryIfIdExists, [paramsId]);
    conn.end();

    res.status(200).json({
      success: true,
      msg: 'data modified successfully',
      'previous data': animesIdSearch[0],
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
  "email": "irene@sample.com",
  "password": "12345678"
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
    res.status(200).json({ success: true, token: token, id: newUser.insertId });
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
  "email": "irene@sample.com",
  "password": "12345678"
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
    //If not exists or wrong pass
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
