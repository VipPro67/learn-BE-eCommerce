"use strict";

const express = require("express");
const { profiles, profile } = require("../../controllers/profile.controller");

const router = express.Router();
const { asyncHandler } = require("../../auth/checkAuth");
const { authenticateToken } = require("../../auth/authUtils");


router.use(authenticateToken);
// /admin
router.get("/viewAny", profiles);

// /shop
router.get("/viewOwn", profile);

module.exports = router;
