//IMPORT NPM REQUIRED
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

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
    `Conexión establecida con la base de datos (identificador=${connection.threadId})`
  );
  return connection;
}

//Endpoint to insert data in animes table

server.post('/add/anime', async (req, res) => {
  const { title, year, chapters } = req.body;

  const insertAnime =
    'INSERT INTO animes (title, year, chapters) VALUES (?, ?, ?);';

  console.log('Enviando datos a la base de datos');
  try {
    const conn = await getConnection();
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
    res.status(501).json({
      success: false,
      error: 'Error en el servidor',
    });
  }
});
