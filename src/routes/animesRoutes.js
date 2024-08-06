const express = require('express');
const router = express.Router();

const db = require('../config/db');
const tokenUtils = require('../utils/tokenUtils');
const validateAnimeInput = require('../middlewares/animesInputValidations');

const maxYear = new Date().getFullYear() + 2;

router.get('/', async (req, res) => {
  const querySelectAllAnimes = 'SELECT * FROM animes';

  console.log('Querying database');
  try {
    const conn = await db.getConnection();
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

router.get('/:id', validateAnimeInput.id, async (req, res) => {
  const ID = req.params.id;

  const querySelectAnimeById = `SELECT * FROM animes WHERE idAnime = ?;`;

  console.log('Querying database');
  try {
    const conn = await db.getConnection();
    const [animes] = await conn.query(querySelectAnimeById, [ID]);
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

/* Example
  ​http://localhost:3113/animes
  {
  "title": "Kimetsu no yaiba",
  "year": "2018",
  "chapters": "105"
} */
router.post(
  '/',
  tokenUtils.authenticate,
  validateAnimeInput.data,
  async (req, res) => {
    const { title, year, chapters } = req.body;

    const MAX_ANIME_COUNT = 8;
    const queryGetTotalAmountAnimes =
      'SELECT COUNT(*) AS total_of_animes FROM animes;';
    const queryGetAnimeByTitle = 'SELECT * FROM animes WHERE title = ?';
    const queryInsertAnime =
      'INSERT INTO animes (title, year, chapters) VALUES (?, ?, ?);';

    console.log('Sending data to database');
    try {
      const conn = await db.getConnection();

      // Check total animes in db
      const [[{ total_of_animes }]] = await conn.query(
        queryGetTotalAmountAnimes
      );

      if (total_of_animes >= MAX_ANIME_COUNT) {
        conn.end();
        console.log('Conection ended');

        return res.status(400).json({
          success: false,
          error: 'The maximum number of anime to register has been reached',
        });
      }

      // Check if title already exists
      const [animeByTitle] = await conn.query(queryGetAnimeByTitle, [title]);
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
  }
);

/* Example
  ​http://localhost:3113/animes/4
  {
  "title": "Kaze no Stigma",
  "year": "2023",
  "chapters": "10"
} */
router.put('/:animeId', tokenUtils.authenticate, async (req, res) => {
  const paramsId = req.params.animeId;
  const { title, year, chapters } = req.body;

  //input validation

  if (isNaN(parseInt(paramsId))) {
    return res.status(400).json({
      success: false,
      error: 'id must be a number',
    });
  }

  // 1, 2, 3 cannot be modified
  if ([1, 2, 3].includes(paramsId)) {
    return res.status(400).json({
      success: false,
      error: 'id 1, 2 or 3 cannot be modified',
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
    const conn = await db.getConnection();
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

/* Example 
  ​http://localhost:3113/animes/4
*/
router.delete('/:animeId', tokenUtils.authenticate, async (req, res) => {
  console.log('Querying database');
  const paramsId = req.params.animeId;

  // input validation

  if (isNaN(parseInt(paramsId))) {
    return res.status(400).json({
      success: false,
      error: 'id must be a number',
    });
  }

  // 1, 2, 3 cannot be modified
  if ([1, 2, 3].includes(paramsId)) {
    return res.status(400).json({
      success: false,
      error: 'id 1, 2 or 3 cannot be modified',
    });
  }

  const queryIfAnimeExists = `SELECT * FROM animes WHERE idAnime = ?;`;
  try {
    const conn = await db.getConnection();
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

module.exports = router;
