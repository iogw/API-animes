const express = require('express');
const router = express.Router();

const validateUserInput = require('../middlewares/usersInputValidation');
const usersController = require('../controllers/usersController');

/* Example
  ​http://localhost:3113/signup/
  {
  "username": "User",
  "email": "user@sample.com",
  "password": "12345678"
} */
router.post('/signup', validateUserInput.signup, usersController.signup);

//Endpoint login
/* Example
    ​http://localhost:3113/login/
    {
    "email": "user@sample.com",
    "password": "12345678"
  } */
router.post('/login', validateUserInput.login, usersController.login);

module.exports = router;
