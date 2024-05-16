const compression = require('compression');
const express = require('express');
const morgan = require('morgan');
const app = express();

//middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

//database

//routes
app.get('/', (req, res, next) => {
  return res.status(200).json({ message: 'Hello World' });
}
);
//error handlers

module.exports = app;