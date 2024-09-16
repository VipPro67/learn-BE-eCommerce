"use strict";
const multer = require("multer");

const fs = require("fs");
const path = require("path");

const uploadDisk = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = "public/uploads/";
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});
module.exports = {
  uploadDisk,
};
