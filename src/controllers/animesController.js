const db = require('../config/db');

const listAllAnimes = async (req, res) => {
  const querySelectAllAnimes = 'SELECT * FROM animes';

  try {
    const conn = await db.getConnection();
    const [results] = await conn.query(querySelectAllAnimes);
    conn.end();

    const numOfElements = results.length;

    res.json({
      success: true,
      info: { count: numOfElements },
      results: results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'database error',
    });
  }
};



module.exports = {
  listAllAnimes,
};
