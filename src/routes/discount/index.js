"use strict";
const express = require("express");
const router = express.Router();
const DiscountController = require("../../controllers/discount.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authenticateToken } = require("../../auth/authUtils");

router.use(authenticateToken);
//get product by discount code
router.get(
  "/products",
  asyncHandler(DiscountController.getProductByDiscountCode)
);
router.post("/create", asyncHandler(DiscountController.createDiscountCode));
router.get("/all", asyncHandler(DiscountController.getAllDiscountCodeSelect));
router.get(
  "/all/unselect",
  asyncHandler(DiscountController.getAllDiscountCodeUnSelect)
);
router.get("/amount", asyncHandler(DiscountController.getAllDiscountAmount));

router.delete(
  "/:discount_code",
  asyncHandler(DiscountController.deleteDiscountCode)
);
router.patch(
  "/:discount_code",
  asyncHandler(DiscountController.updateDiscountCode)
);

module.exports = router;
