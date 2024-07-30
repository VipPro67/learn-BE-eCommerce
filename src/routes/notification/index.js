"use strict";
const express = require("express");
const router = express.Router();
const NotificationController = require("../../controllers/notification.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authenticateToken } = require("../../auth/authUtils");

router.use(authenticateToken);
// router.post("", asyncHandler(NotificationController.pushNotiToSystem));
router.get("", asyncHandler(NotificationController.getNotificationByUserId));

module.exports = router;
