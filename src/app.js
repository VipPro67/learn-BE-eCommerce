const compression = require("compression");
const helmet = require("helmet");
const express = require("express");
const morgan = require("morgan");
const app = express();

//middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//database
require("./dbs/init.mongodb");

//helpers
const { checkOverload } = require("./helpers/check.connect");
checkOverload();

//routes
const indexRouter = require("./routes/index");
app.use("/", indexRouter);
//error handlers

module.exports = app;
