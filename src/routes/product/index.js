"use strict";
const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authenticateToken } = require("../../auth/authUtils");
const { readCache } = require("../../middlewares/cache.middleware");
const { validateProductQuery } = require("../../validations/product.validation");

router.get(
  "/search/:keysearch",
  asyncHandler(ProductController.searchProductsUser)
);
router.get("/sku/select_variation", asyncHandler(ProductController.findOneSku));
router.get("/spu/get_spu_info", asyncHandler(ProductController.findOneSpu));
router.get(
  "/sku/select_variation",
  validateProductQuery,
  readCache,
  asyncHandler(ProductController.findOneSku)
);

router.get("/all", asyncHandler(ProductController.findAllProducts));

router.get("/:product_id", asyncHandler(ProductController.findProductById));

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
router.post("/spu/new", asyncHandler(ProductController.createSpu));
router.get(
  "/published/all",
  asyncHandler(ProductController.getAllPublicProductByShop)
);

router.patch("/:product_id", asyncHandler(ProductController.updateProductById));

module.exports = router;
