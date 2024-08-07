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

const listOneAnime = async (req, res) => {
  const ID = req.params.id;

  const querySelectAnimeById = `SELECT * FROM animes WHERE idAnime = ?;`;

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
};

const addNewAnime = async (req, res) => {
  const { title, year, chapters } = req.body;

  const MAX_ANIME_COUNT = 8;
  const queryGetTotalAmountAnimes =
    'SELECT COUNT(*) AS total_of_animes FROM animes;';
  const queryGetAnimeByTitle = 'SELECT * FROM animes WHERE title = ?';
  const queryInsertAnime =
    'INSERT INTO animes (title, year, chapters) VALUES (?, ?, ?);';

  try {
    const conn = await db.getConnection();

    // Check total animes in db
    const [[{ total_of_animes }]] = await conn.query(queryGetTotalAmountAnimes);

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
      msg: 'Anime created',
      id: resultAnime.insertId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'database error',
    });
  }
};

const updateAnime = async (req, res) => {
  const paramsId = req.params.id;
  const { title, year, chapters } = req.body;

  //Check if anime exists in db by id

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
        error: `anime with ID ${paramsId} not found`,
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
};

const deleteAnime = async (req, res) => {
  const paramsId = req.params.id;

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
    await conn.query(queryDeleteAnime, [paramsId]);
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
};

module.exports = {
  listAllAnimes,
  listOneAnime,
  addNewAnime,
  updateAnime,
  deleteAnime,
};
