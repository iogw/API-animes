const db = require('../config/db');
const query = require('../queries/animesQueries');
const jsonRes = require('../utils/apiResponse');

const errorMsgMaxReached = 'No more registrations allowed';
const errorMsgTitleRepeat = 'This title already exists';

function endDbConn(dbConn) {
  if (dbConn) dbConn.end();
  console.log('Database connection ended');
}

// endpoints
const listAll = async (req, res) => {
  let dbConn;
  try {
    const dbConn = await db.getConnection();
    const [results] = await dbConn.query(query.getAll);

    let data = {
      count: results.length,
      results: results,
    };
    return jsonRes(res, 'ok', { data: data });
  } catch (error) {
    console.error(error);
    return jsonRes(res, 'internalServerError', { error: error.errno });
  } finally {
    endDbConn(dbConn);
  }
};

const listOne = async (req, res) => {
  const ID = req.params.id;
  let dbConn;

  try {
    const dbConn = await db.getConnection();
    const [animes] = await dbConn.query(query.getById, [ID]);
    const anime = animes[0];

    if (!anime) return jsonRes(res, 'notFound');

    return jsonRes(res, 'ok', { data: anime });
  } catch (error) {
    console.error(error);
    return jsonRes(res, 'internalServerError', { error: error.errno });
  } finally {
    endDbConn(dbConn);
  }
};

const addNew = async (req, res) => {
  const MAX_COUNT = 20;
  const { title, year, chapters } = req.body;
  let dbConn;

  try {
    const dbConn = await db.getConnection();
    // Checks

    const [[{ total_of_animes }]] = await dbConn.query(query.getTotalCount);
    const [animeByTitle] = await dbConn.query(query.getByTitle, [title]);

    if (total_of_animes >= MAX_COUNT)
      return jsonRes(res, 'badRequest', { error: errorMsgMaxReached });

    if (animeByTitle[0])
      return jsonRes(res, 'badRequest', { error: errorMsgTitleRepeat });

    // Insert new data
    const [addedRes] = await dbConn.query(query.add, [title, year, chapters]);
    const data = { id: addedRes.insertId };
    return jsonRes(res, 'created', { data: data });
  } catch (error) {
    console.error(error);
    return jsonRes(res, 'internalServerError', { error: error.errno });
  } finally {
    endDbConn(dbConn);
  }
};

const updateAni = async (req, res) => {
  const paramsId = req.params.id;
  const { title, year, chapters } = req.body;

  let dbConn;

  try {
    const dbConn = await db.getConnection();

    // Checks
    const [animeDataOri] = await dbConn.query(query.getById, [paramsId]);
    const [animeByTitle] = await dbConn.query(query.getByTitle, [title]);

    if (!animeDataOri[0]) return jsonRes(res, 'notFound');
    if (animeByTitle[0] && animeByTitle[0].idAnime !== parseInt(paramsId))
      return jsonRes(res, 'badRequest', { error: errorMsgTitleRepeat });

    // Update
    await dbConn.query(query.update, [title, year, chapters, paramsId]);
    const [animeUpdated] = await dbConn.query(query.getById, [paramsId]);
    const data = { previousData: animeDataOri[0], newData: animeUpdated[0] };

    return jsonRes(res, 'ok', { data: data });
  } catch (error) {
    console.error(error);
    return jsonRes(res, 'internalServerError', { error: error.errno });
  } finally {
    endDbConn(dbConn);
  }
};

const deleteAni = async (req, res) => {
  const paramsId = req.params.id;
  let dbConn;

  try {
    const dbConn = await db.getConnection();

    // Checks
    const [animes] = await dbConn.query(query.getById, [paramsId]);
    if (!animes[0]) return jsonRes(res, 'notFound');

    // Delete
    await dbConn.query(query.deleteAnime, [paramsId]);
    return jsonRes(res, 'ok');
  } catch (error) {
    console.error(error);
    return jsonRes(res, 'internalServerError', { error: error.errno });
  } finally {
    endDbConn(dbConn);
  }
};

module.exports = {
  listAll,
  listOne,
  addNew,
  updateAni,
  deleteAni,
};
