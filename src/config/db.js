const mysql = require('mysql2/promise');
require('dotenv').config();


async function getDatabaseConnection() {
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

  module.exports = { getDatabaseConnection };