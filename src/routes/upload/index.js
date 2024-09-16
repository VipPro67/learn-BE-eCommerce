"use strict";
const express = require("express");
const router = express.Router();
const UploadController = require("../../controllers/upload.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authenticateToken } = require("../../auth/authUtils");
const { uploadDisk,uploadMemory } = require("../../config/multer.config");

router.use(authenticateToken);
//get product by discount code
router.post("/products", asyncHandler(UploadController.uploadFilesToCloudinary));
router.post(
  "/products/local",
  uploadDisk.array("files", 10),
  asyncHandler(UploadController.uploadFilesFromLocalToCloudinary)
);
router.post(
  "/products/bucket",
  uploadMemory.array("files", 10),
  asyncHandler(UploadController.uploadFilesFromLocalToS3)
);

module.exports = router;
