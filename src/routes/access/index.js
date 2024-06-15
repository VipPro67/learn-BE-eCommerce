"use strict";
const express = require("express");
const router = express.Router();
const AccessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authenticateToken } = require("../../auth/authUtils");

//signup
router.post("/shop/signup", asyncHandler(AccessController.signUp));

//login
router.post("/shop/login", asyncHandler(AccessController.login));
//authen
router.use(authenticateToken);

router.post("/shop/logout", asyncHandler(AccessController.logout));
router.post("/shop/refresh-token", asyncHandler(AccessController.handleRefreshToken));

module.exports = router;
