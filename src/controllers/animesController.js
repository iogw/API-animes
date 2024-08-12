const db = require('../config/db');
const query = require('../queries/animesQueries');
const ApiResponse = require('../utils/apiResponse');
const ApiResponseTwo = require('../utils/apiResponseTwo');

// responses

// const esquemaRespuesta = {
//   value: {},
//   errors: [],
//   success: boolean,
// };

const notFoundResponse = (res) => {
  return res.status(404).json({
    success: false,
    error: 'anime not found',
  });
};

function jsonRes(res, method, { data = undefined, error = undefined } = {}) {
  const jsonRes = new ApiResponseTwo(res, data, error);

  if (typeof jsonRes[method] === 'function') {
    return jsonRes[method]();
  } else {
    return console.log('CHECK CONTROLLER: METHOD NAME');
  }
}

function personalizedRes(name, res, error = null) {
  if ((name = 'dbError'))
    return jsonRes(res, 'internalServerError', { error: error });

  if ((name = 'maxReached'))
    return jsonRes(res, 'badRequest', {
      error: 'No more registrations allowed',
    });

  if ((name = 'titleAlreadyExists'))
    return jsonRes(res, 'badRequest', {
      error: 'This title already exists',
    });
}

// function dbError(res, error) {
//   return jsonRes(res, 'internalServerError', { error: error });
// }
// function titleAlreadyExists(res) {
//   return jsonRes(res, 'badRequest', {
//     error: 'This title already exists',
//   });
// }
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
    return dbError(res, error.errno);
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
    return dbError(res, error.errno);
  } finally {
    endDbConn(dbConn);
  }
};

const addNew = async (req, res) => {
  const MAX_ANIME_COUNT = 15;
  const { title, year, chapters } = req.body;
  let dbConn;

  try {
    const dbConn = await db.getConnection();
    // Checks
    const [[{ total_of_animes }]] = await dbConn.query(query.getTotalCount);
    const [animeByTitle] = await dbConn.query(query.getByTitle, [title]);

    if (total_of_animes >= MAX_ANIME_COUNT)
      return personalizedRes(res, 'maxReached');
    // return jsonRes(res, 'badRequest', {
    //   error: 'The number of registrations has been reached',
    // });
    if (animeByTitle[0]) return personalizedRes(res, 'titleAlreadyExists');

    // Insert new data
    const [addedRes] = await dbConn.query(query.add, [title, year, chapters]);
    const data = { id: addedRes.insertId };
    return jsonRes(res, 'created', { data: data });
  } catch (error) {
    console.error(error);
    return dbError(res, error.errno);
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

    // Get data if anime exists
    const [animeDataOri] = await dbConn.query(query.getById, [paramsId]);
    if (!animeDataOri[0]) return jsonRes(res, 'notFound');

    // Check if title already exists (excluding the current anime)
    const [animeByTitle] = await dbConn.query(query.getByTitle, [title]);

    if (animeByTitle[0] && animeByTitle[0].idAnime !== parseInt(paramsId))
      return titleAlreadyExists(res);

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
    return dbError(res, error.errno);
  } finally {
    endDbConn(dbConn);
  }
};

const deleteAni = async (req, res) => {
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
    return dbError(res, error.errno);
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
