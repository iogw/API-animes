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

// INIT
const PORT = 3113;
app.listen(PORT, () =>
  console.log(`Server listening at http://localhost:${PORT}`)
);

module.exports = app;
