const express = require('express');
const router = express.Router();
const { getDatabaseConnection } = require('../config/db');


const maxYear = new Date().getFullYear() + 2;

router.get('/animes', async (req, res) => {
  const querySelectAllAnimes = 'SELECT * FROM animes';

  console.log('Querying database');
  try {
    const conn = await getDatabaseConnection();
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


module.exports = router;
