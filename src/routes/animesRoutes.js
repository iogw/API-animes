const express = require('express');
const router = express.Router();

const { authenticate } = require('../middlewares/authMiddleware');
const validateAnimeInput = require('../middlewares/animesInputValidations');

const animesController = require('../controllers/animesController');

router.get('/', animesController.listAllAnimes);
router.get('/:id', validateAnimeInput.id, animesController.listOneAnime);

/* Example
  ​http://localhost:3113/animes
  {
  "title": "Kimetsu no yaiba",
  "year": "2018",
  "chapters": "105"
} */
router.post(
  '/',
  authenticate,
  validateAnimeInput.data,
  animesController.addNewAnime
);

/* Example
  ​http://localhost:3113/animes/4
  {
  "title": "Kaze no Stigma",
  "year": "2023",
  "chapters": "10"
} */
router.put(
  '/:id',
  authenticate,
  validateAnimeInput.idAndImmutable,
  validateAnimeInput.data,
  animesController.updateAnime
);

/* Example 
  ​http://localhost:3113/animes/4
*/
router.delete(
  '/:id',
  authenticate,
  validateAnimeInput.idAndImmutable,
  animesController.deleteAnime
);

module.exports = router;
