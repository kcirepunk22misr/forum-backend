// Requires
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Ejecutar express
const app = express();

// CORS
app.use(cors({ origin: true, credentials: true }));

// Cargar archivos de rutas
const userRoutes = require('./routes/user.routes');
const topicRoutes = require('./routes/topic.routes');
const commentRoutes = require('./routes/comment.routes');

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS

// Rutas
app.use('/api', userRoutes);
app.use('/api', topicRoutes);
app.use('/api', commentRoutes);

// Exportar modulo
module.exports = app;
