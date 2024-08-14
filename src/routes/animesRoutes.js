const express = require('express');
const router = express.Router();

const { authenticate } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/animesInputValidations');

const controller = require('../controllers/animesController');

router.get('/', controller.listAll);
router.get('/:id', validate.id, controller.listOne);

router.post('/', authenticate, validate.data, controller.addNew);

router.put(
  '/:id',
  authenticate,
  validate.idAndImmutable,
  validate.data,
  controller.updateAni
);

router.delete(
  '/:id',
  authenticate,
  validate.idAndImmutable,
  controller.deleteAni
);

module.exports = router;
