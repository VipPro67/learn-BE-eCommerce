
"use strict";
const express = require("express");
const router = express.Router();
const CheckoutController = require("../../controllers/checkout.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authenticateToken } = require("../../auth/authUtils");

router.use(authenticateToken);
router.post("/review", asyncHandler(CheckoutController.checkoutReview));

module.exports = router;
