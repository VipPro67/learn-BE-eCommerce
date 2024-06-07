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
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
    });

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        error: {
            status: 'error',
            code: statusCode,
            message: error.message || 'Internal Server Error',
        },
    });
}
);

module.exports = app;
