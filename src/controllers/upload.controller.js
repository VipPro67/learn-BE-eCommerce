"use strict";

const { uploadImageFromURL } = require("../services/upload.service");
const { Created } = require("../core/success.response");

class UploadController {
  async uploadFile(req, res, next) {
    try {
      const result = await uploadImageFromURL({
        imageUrl: req.body.imageUrl,
        type: req.body.type,
        name: req.body.name,
      });
      new Created("Create new product success", result).send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UploadController();
