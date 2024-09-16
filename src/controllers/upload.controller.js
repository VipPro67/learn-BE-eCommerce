"use strict";

const { uploadImageFromURL,uploadFileFromLocal } = require("../services/upload.service");
const { OK } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");

class UploadController {
  async uploadFile(req, res, next) {
    try {
      const result = await uploadImageFromURL({
        imageUrl: req.body.fileUrl,
        type: req.body.type,
        name: req.body.name,
      });
      new OK("Upload file success", result).send(res);
    } catch (error) {
      next(error);
    }
  }

  async uploadFileFromLocal(req, res, next) {
    try {
      if (!req.file) {
        throw new BadRequestError("Error: Missing file");
      }

      const result = await uploadFileFromLocal({
        file: req.file,
      });
      new OK("Upload file success", result).send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UploadController();
