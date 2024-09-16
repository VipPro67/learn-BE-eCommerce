"use strict";
const express = require("express");
const router = express.Router();
const UploadController = require("../../controllers/upload.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authenticateToken } = require("../../auth/authUtils");
const { uploadDisk } = require("../../config/multer.config");

router.use(authenticateToken);
//get product by discount code
router.post("/products", asyncHandler(UploadController.uploadFile));
router.post(
  "/products/local",
  uploadDisk.single("file"),
  asyncHandler(UploadController.uploadFileFromLocal)
);

module.exports = router;
