"use strict";
const express = require("express");
const router = express.Router();
const CommentController = require("../../controllers/comment.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authenticateToken } = require("../../auth/authUtils");

router.use(authenticateToken);
//get product by discount code
router.post("", asyncHandler(CommentController.createComment));
router.get("", asyncHandler(CommentController.getCommentByParentId));
router.delete("", asyncHandler(CommentController.deleteComment));

module.exports = router;
