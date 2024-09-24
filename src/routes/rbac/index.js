"use strict";

const express = require("express");
const {
  newResource,
  newRole,
  listResources,
  listRoles,
} = require("../../controllers/rbac.controller");

const router = express.Router();

const { asyncHandler } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");

router.post("/role", asyncHandler(newRole));
router.get("/roles", asyncHandler(listRoles));

router.post("/resource", asyncHandler(newResource));
router.get("/resources", asyncHandler(listResources));

module.exports = router;
