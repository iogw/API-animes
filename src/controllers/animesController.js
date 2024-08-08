const db = require('../config/db');
const query = require('../queries/animesQueries');

// responses

const notFoundResponse = (res) => {
  return res.status(404).json({
    success: false,
    error: 'anime not found',
  });
};
const dbErrorResponse = (res) => {
  return res.status(500).json({
    success: false,
    error: 'database error',
  });
};

// endpoints
const listAllAnimes = async (req, res) => {
  let dbConn;
  try {
    const dbConn = await db.getConnection();
    const [results] = await dbConn.query(query.getAll);
    const count = results.length;

    return res.status(200).json({
      success: true,
      info: { count: count },
      results: results,
    });
  } catch (error) {
    console.error(error);
    return dbErrorResponse(res);
  } finally {
    if (dbConn) dbConn.end();
    console.log('Database connection ended');
  }
};

const listOneAnime = async (req, res) => {
  const ID = req.params.id;
  let dbConn;

  try {
    const dbConn = await db.getConnection();
    const [animes] = await dbConn.query(query.getById, [ID]);
    const anime = animes[0];

    // Check if anime exists
    if (!anime) {
      return notFoundResponse(res);
    }

    // List anime
    return res.status(200).json({
      success: true,
      results: anime,
    });
  } catch (error) {
    console.error(error);
    return dbErrorResponse(res);
  } finally {
    if (dbConn) dbConn.end();
    console.log('Database connection ended');
  }
};

const addNewAnime = async (req, res) => {
  const MAX_ANIME_COUNT = 8;
  const { title, year, chapters } = req.body;
  let dbConn;

  try {
    const dbConn = await db.getConnection();
    const [[{ total_of_animes }]] = await dbConn.query(query.getTotalCount);

    // Check if reached max animes
    if (total_of_animes >= MAX_ANIME_COUNT) {
      return res.status(400).json({
        success: false,
        error: 'The maximum number of anime to register has been reached',
      });
    }

    // Check if title already exists
    const [animeByTitle] = await dbConn.query(query.getByTitle, [title]);
    if (animeByTitle[0]) {
      return res.status(400).json({
        success: false,
        error: 'This title already exists',
      });
    }

    // Insert new data
    const [dbResponseWhenAdd] = await dbConn.query(query.add, [
      title,
      year,
      chapters,
    ]);

    return res.status(200).json({
      success: true,
      msg: 'Anime created',
      id: dbResponseWhenAdd.insertId,
    });
  } catch (error) {
    console.error(error);
    return dbErrorResponse(res);
  } finally {
    if (dbConn) dbConn.end();
    console.log('Database connection ended');
  }
};

const updateAnime = async (req, res) => {
  const paramsId = req.params.id;
  const { title, year, chapters } = req.body;

  let dbConn;

  try {
    const dbConn = await db.getConnection();

    // Check if anime exists
    const [animeDataOri] = await dbConn.query(query.getById, [paramsId]);
    if (!animeDataOri[0]) {
      return notFoundResponse(res);
    }

    // Check if title already exists (excluding the current anime)
    const [animeByTitle] = await dbConn.query(query.getByTitle, [title]);

    if (animeByTitle[0] && animeByTitle[0].idAnime !== parseInt(paramsId)) {
      return res.status(400).json({
        success: false,
        error: 'this title already exists',
      });
    }

    // Update
    await dbConn.query(query.update, [title, year, chapters, paramsId]);
    const [animeUpdated] = await dbConn.query(query.getById, [paramsId]);

    return res.status(200).json({
      success: true,
      msg: 'Data modified successfully',
      previousData: animeDataOri[0],
      newData: animeUpdated[0],
    });
  } catch (error) {
    console.error(error);
    return dbErrorResponse(res);
  } finally {
    if (dbConn) dbConn.end();
    console.log('Database connection ended');
  }
};

const deleteAnime = async (req, res) => {
  const paramsId = req.params.id;
  let dbConn;

  try {
    const dbConn = await db.getConnection();

    // Check if anime exists
    const [animes] = await dbConn.query(query.getById, [paramsId]);
    if (!animes[0]) {
      return notFoundResponse(res);
    }

    // Delete
    await dbConn.query(query.deleteAnime, [paramsId]);
    return res.status(200).json({
      success: true,
      msg: `anime "${animes[0].title}" deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    return dbErrorResponse(res);
  } finally {
    if (dbConn) dbConn.end();
    console.log('Database connection ended');
  }
};

module.exports = {
  listAllAnimes,
  listOneAnime,
  addNewAnime,
  updateAnime,
  deleteAnime,
};
