const mysql = require('mysql2/promise');
require('dotenv').config();

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
function endConnection(connection) {
  if (connection) connection.end();
  console.log(`Database connection ended (identifier=${connection.threadId})`);
}

module.exports = { getConnection, endConnection };
