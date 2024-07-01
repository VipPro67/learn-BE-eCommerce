"use strict";
const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authenticateToken } = require("../../auth/authUtils");

//authen
router.use(authenticateToken);

router.post('', asyncHandler(ProductController.createProduct));

module.exports = router;
