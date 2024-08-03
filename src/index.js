// NPM MODULES
const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

const bcrypt = require('bcrypt');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// LOCALE MODULES
const { getDatabaseConnection } = require('./config/db');
const { generateToken, authenticateToken } = require('./utils/tokenUtils');
// const validate = require('./utils/validationUtils');
const routes = require('./routes/animesRoutes');

app.use('/', routes);

//CREATE & CONFIG SERVER

// SERVER PORT
const PORT = 3113;
app.listen(PORT, () =>
  console.log(`Server listening at http://localhost:${PORT}`)
);

//Endpoint user registration
/* Example
  ​http://localhost:3113/signup/
  {
  "username": "Irene",
  "email": "irene@sample.com",
  "password": "12345678"
} */
app.post('/signup', async (req, res) => {
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
    const conn = await getDatabaseConnection();
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
app.post('/login', async (req, res) => {
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
    const conn = await getDatabaseConnection();
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

module.exports = app;
