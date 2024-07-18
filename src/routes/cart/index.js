"use strict";
const express = require("express");
const router = express.Router();
const CartController = require("../../controllers/cart.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authenticateToken } = require("../../auth/authUtils");

router.use(authenticateToken);
router.post("/add", asyncHandler(CartController.addToCart));
router.patch("/update", asyncHandler(CartController.updateCartQuantity));
router.delete("/delete", asyncHandler(CartController.deleleCart));
router.get("/", asyncHandler(CartController.getCartByUserId));

module.exports = router;
