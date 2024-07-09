"use strict";
const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const router = express.Router();

//check apiKey
router.use(apiKey);

router.use(permission("0000"));

router.use("/api/v1/", require("./access"));
router.use("/api/v1/product", require("./product"));
router.use("/api/v1/discount", require("./discount"));
router.use("/api/v1/cart", require("./cart"));

module.exports = router;
