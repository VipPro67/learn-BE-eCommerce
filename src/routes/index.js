"use strict";

const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const { sendMessage, sendFormatLog } = require("../middlewares");
const router = express.Router();

router.use(sendFormatLog);

//check apiKey
router.use(apiKey);

router.use(permission("0000"));

router.use("/api/v1/", require("./access"));
router.use("/v1/api/checkout", require("./checkout"));
router.use("/v1/api/email", require("./email"));
router.use("/api/v1/rbac", require("./rbac"));
router.use("/api/v1/profile", require("./profile"));
router.use("/api/v1/product", require("./product"));
router.use("/api/v1/discount", require("./discount"));
router.use("/api/v1/cart", require("./cart"));
router.use("/api/v1/checkout", require("./checkout"));
router.use("/api/v1/inventory", require("./inventory"));
router.use("/api/v1/comment", require("./comment"));
router.use("/api/v1/notification", require("./notification"));
router.use("/api/v1/upload", require("./upload"));

module.exports = router;
