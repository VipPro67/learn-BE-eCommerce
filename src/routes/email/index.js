"use strict";
const express = require("express");
const router = express.Router();
const emailController = require("../../controllers/email.controller");
const { asyncHandler } = require("../../auth/checkAuth");

router.post("/new_template", asyncHandler(emailController.newTemplate));


module.exports = router;
