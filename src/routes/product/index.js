"use strict";
const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authenticateToken } = require("../../auth/authUtils");

//authen
router.use(authenticateToken);

router.post("", asyncHandler(ProductController.createProduct));
router.get("/draft/all", asyncHandler(ProductController.getAllDraftForShop));
router.post(
  "/published/:product_id",
  asyncHandler(ProductController.publicProductByShop)
);
router.post(
  "/unpublished/:product_id",
  asyncHandler(ProductController.unPublicProductByShop)
);
router.get(
  "/published/all",
  asyncHandler(ProductController.getAllPublicProductByShop)
);

module.exports = router;
