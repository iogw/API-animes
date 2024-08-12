const getAll = 'SELECT * FROM animes;';
const getTotalCount = 'SELECT COUNT(*) AS db_count FROM animes;';
const add = 'INSERT INTO animes (title, year, chapters) VALUES (?, ?, ?);';
const update =
  'UPDATE animes SET title = ?, year = ?, chapters = ? WHERE idAnime = ?;';
const deleteAnime = 'DELETE FROM animes WHERE idAnime = ?;';
const getById = `SELECT * FROM animes WHERE idAnime = ?;`;
const getByTitle = `SELECT * FROM animes WHERE title = ?;`;

module.exports = {
  getAll,
  getTotalCount,
  add,
  update,
  deleteAnime,
  getById,
  getByTitle,
};
