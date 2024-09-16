const {
  uploadFilesFromURL,
  uploadFilesFromLocal,
  uploadFilesLocalToS3,
} = require("../services/upload.service");
const { OK } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");

class UploadController {
  async uploadFilesToCloudinary(req, res, next) {
    try {
      const files = req.body.files || []; // Assuming an array of URLs for multiple uploads
      const results = await Promise.all(
        files.map(async (file) => {
          return await uploadFilesFromURL({
            fileUrl: file.url,
            type: file.type,
            name: file.name,
          });
        })
      );
      new OK("Upload files success", results).send(res);
    } catch (error) {
      next(error);
    }
  }

  async uploadFilesFromLocalToCloudinary(req, res, next) {
    try {
      if (!req.files || req.files.length === 0) {
        throw new BadRequestError("Error: No files uploaded");
      }

      const results = await Promise.all(
        req.files.map(async (file) => {
          return await uploadFilesFromLocal({ file });
        })
      );
      new OK("Upload files success", results).send(res);
    } catch (error) {
      next(error);
    }
  }

  async uploadFilesFromLocalToS3(req, res, next) {
    try {
      if (!req.files || req.files.length === 0) {
        throw new BadRequestError("Error: No files uploaded");
      }

      const results = await Promise.all(
        req.files.map(async (file) => {
          return await uploadFilesLocalToS3({ file });
        })
      );
      new OK("Upload files success", results).send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UploadController();
