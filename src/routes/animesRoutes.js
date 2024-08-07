const express = require('express');
const router = express.Router();

const { authenticate } = require('../middlewares/authMiddleware');
const validateAnimeInput = require('../middlewares/animesInputValidations');

const animesController = require('../controllers/animesController');

router.get('/', animesController.listAllAnimes);
router.get('/:id', validateAnimeInput.id, animesController.listOneAnime);

router.post(
  '/',
  authenticate,
  validateAnimeInput.data,
  animesController.addNewAnime
);

router.put(
  '/:id',
  authenticate,
  validateAnimeInput.idAndImmutable,
  validateAnimeInput.data,
  animesController.updateAnime
);

router.delete(
  '/:id',
  authenticate,
  validateAnimeInput.idAndImmutable,
  animesController.deleteAnime
);

module.exports = router;
