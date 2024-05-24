"use strict";

const dev = {
  app: {
    port: process.env.DEVPORT || 3001,
  },
  db: {
    uri: process.env.MONGODB_URI,
  },
};

const pro = {
  app: {
    port: process.env.PORT || 3001,
  },
  db: {
    uri: process.env.MONGODB_URI,
    host: process.env.MONGODB_HOST || "localhost",
    user: process.env.MONGODB_USERNAME || "root",
    password: process.env.MONGODB_PASSWORD || "root",
    database: process.env.MONGODB_DATABASE || "test",
    port: process.env.MONGODB_PORT || 27017,
    dbname : process.env.MONGODB_DBNAME || "express-mongodb",
  },
};

const config = process.env.NODE_ENV === "pro" ? pro : dev;
module.exports = { config };
