"use strict";
const CommentService = require("../services/comment.service");
const { getInfoData } = require("../utils/index");
const { Created, OK } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");
class CommentController {
  static async createComment(req, res) {
    const { productId, userId, content, parentId } = req.body;
    const comment = await CommentService.createComment({
      productId,
      userId,
      content,
      parentId,
    });
    new Created("Create comment success", comment).send(res);
  }

  static async getCommentByParentId(req, res) {
    const { productId, parentCommentId, limit, offset } = req.query;
    const comments = await CommentService.getCommentByParentId({
      productId,
      parentCommentId,
      limit,
      offset,
    });
    new OK("Get comment success", comments).send(res);
  }

  static async deleteComment(req, res) {
    const { commentId, productId } = req.query;
 const comment = await CommentService.deleteComment({
      commentId,
      productId,
    });
    if (!comment) {
      throw new BadRequestError("Comment not found");
    }
    new OK("Delete comment success", comment).send(res);
  }
}

module.exports = CommentController;
