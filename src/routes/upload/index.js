"use strict";
const express = require("express");
const router = express.Router();
const UploadController = require("../../controllers/upload.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authenticateToken } = require("../../auth/authUtils");

router.use(authenticateToken);
//get product by discount code
router.post(
  "/products",
  asyncHandler(UploadController.uploadFile)
);

module.exports = router;
