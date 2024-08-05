// IMPORTS

// express
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

//  swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routes
const animesRoutes = require('./routes/animesRoutes');
const usersRoutes = require('./routes/usersRoutes');
app.use('/animes', animesRoutes);
app.use('/', usersRoutes);

//merge
// SERVER PORT
// const PORT = process.env.PORT || 3113;
// server.listen(PORT, () =>
//   console.log(`Server listening at http://localhost:${PORT}`)
// );


// // Endpoint to insert new anime
// /* Example
//   ​http://localhost:3113/animes/4
//   {
//   "title": "Kimetsu no yaiba",
//   "year": "2018",
//   "chapters": "105"
// } */

//Endpoint to update and delete anime

  
  // if ([1, 2, 3].includes(paramsId)) {
  //   return res.status(400).json({
  //     success: false,
  //     error: 'id 1, 2 or 3 cannot be modified',
  //   });
  // }
  

// INIT
const PORT = 3113;
app.listen(PORT, () =>
  console.log(`Server listening at http://localhost:${PORT}`)
);

module.exports = app;
