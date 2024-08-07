const db = require('../config/db');
const query = require('../queries/animesQueries');

const listAllAnimes = async (req, res) => {
  try {
    const conn = await db.getConnection();
    const [results] = await conn.query(query.getAll);
    conn.end();

    const count = results.length;

    res.json({
      success: true,
      info: { count: count },
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

  try {
    const conn = await db.getConnection();
    const [animes] = await conn.query(query.getById, [ID]);
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

  try {
    const conn = await db.getConnection();

    // Check total animes in db
    const [[{ total_of_animes }]] = await conn.query(query.getTotalCount);

    if (total_of_animes >= MAX_ANIME_COUNT) {
      conn.end();
      console.log('Conection ended');

      return res.status(400).json({
        success: false,
        error: 'The maximum number of anime to register has been reached',
      });
    }

    // Check if title already exists
    const [animeByTitle] = await conn.query(query.getByTitle, [title]);
    if (animeByTitle.length !== 0) {
      conn.end();
      console.log('Conection ended');

      return res.status(400).json({
        success: false,
        error: 'This title already exists',
      });
    }

    // Insert new data
    const [dbResponseWhenAdd] = await conn.query(query.add, [
      title,
      year,
      chapters,
    ]);

    conn.end();
    console.log('Conection ended');

    return res.status(200).json({
      success: true,
      msg: 'Anime created',
      id: dbResponseWhenAdd.insertId,
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

  try {
    const conn = await db.getConnection();

    const [animeDataPrevious] = await conn.query(query.getById, [
      paramsId,
    ]);
    if (animeDataPrevious.length === 0) {
      conn.end();
      return res.status(404).json({
        success: false,
        error: `anime with ID ${paramsId} not found`,
      });
    }

    const [animeByTitle] = await conn.query(query.getByTitle, [title]);
    if (animeByTitle.length !== 0) {
      conn.end();
      return res.status(400).json({
        success: false,
        error: 'this title already exists',
      });
    }

    await conn.query(query.update, [title, year, chapters, paramsId]);
    const [animeUpdated] = await conn.query(query.getById, [paramsId]);
    conn.end();

    res.status(200).json({
      success: true,
      msg: 'data modified successfully',
      'previous data': animeDataPrevious[0],
      'new data': animeUpdated[0],
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

  try {
    const conn = await db.getConnection();
    const [animes] = await conn.query(query.getById, [paramsId]);
    if (animes.length === 0) {
      conn.end();
      return res.status(404).json({
        success: false,
        error: 'anime not found',
      });
    }

    await conn.query(query.deleteAnime, [paramsId]);
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
