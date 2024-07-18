"use strict";
const express = require("express");
const router = express.Router();
const CheckoutController = require("../../controllers/checkout.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authenticateToken } = require("../../auth/authUtils");

router.use(authenticateToken);
router.post("/review", asyncHandler(CheckoutController.checkoutReview));
router.post("/order", asyncHandler(CheckoutController.orderByUser));
router.get("/order", asyncHandler(CheckoutController.getOrderByUser));
router.patch("/order", asyncHandler(CheckoutController.cancelOrderByUser));
router.patch("/update", asyncHandler(CheckoutController.updateOrderByShop));

module.exports = router;
