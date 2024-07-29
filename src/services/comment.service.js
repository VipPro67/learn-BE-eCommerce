"use strict";
const Comment = require("../models/comment.model");
const { convertToObjectId } = require("../utils/index");
const { BadRequestError } = require("../core/error.response");
const { findProductById } = require("../models/repositories/product.repo");

class CommentService {
  static async createComment({ productId, userId, content, parentId = null }) {
    const comment = new Comment({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentId,
    });

    let rightValue;

    if (parentId) {
      const parentComment = await Comment.findById(parentId, "comment_right");
      if (!parentComment) {
        throw new BadRequestError("Parent comment not found");
      }
      rightValue = parentComment.comment_right;
      await Comment.updateMany(
        { comment_right: { $gte: rightValue } },
        { $inc: { comment_right: 2 } }
      );
      await Comment.updateMany(
        { comment_left: { $gt: rightValue } },
        { $inc: { comment_left: 2 } }
      );
      comment.comment_left = rightValue;
      comment.comment_right = rightValue + 1;
    } else {
      const maxRightValue = await Comment.findOne(
        {
          comment_productId: convertToObjectId(productId),
        },
        "comment_right"
      ).sort({ comment_right: -1 });
      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    await comment.save();
    return comment;
  }

  static async getCommentByParentId({
    productId,
    parentCommentId,
    limit = 50,
    offset = 0,
  }) {
    if (parentCommentId) {
      const parentComment = await Comment.findById(
        convertToObjectId(parentCommentId)
      );
      if (!parentComment) {
        throw new BadRequestError("Parent comment not found");
      }

      const comments = await Comment.find({
        comment_left: { $gt: parentComment.comment_left },
        comment_productId: convertToObjectId(productId),
        comment_right: { $lt: parentComment.comment_right },
      })
        .sort({ comment_left: 1 })
        .select({
          comment_content: 1,
          comment_userId: 1,
          comment_left: 1,
          comment_right: 1,
        })
        .skip(offset)
        .limit(limit);

      return comments;
    }
    const comments = await Comment.find({
      comment_parentId: null,
      comment_productId: convertToObjectId(productId),
    })
      .sort({ comment_left: 1 })
      .select({
        comment_content: 1,
        comment_userId: 1,
        comment_left: 1,
        comment_right: 1,
      })
      .skip(offset)
      .limit(limit);

    return comments;
  }

  static async deleteComment({ commentId, productId }) {
    const foundProduct = await findProductById({
      product_id: convertToObjectId(productId),
    });

    if (!foundProduct) {
      throw new BadRequestError("Product not found");
    }

    const comment = await Comment.findById(convertToObjectId(commentId));
    if (!comment) {
      throw new BadRequestError("Comment not found");
    }

    const leftValue = comment.comment_left;
    const rightValue = comment.comment_right;

    const width = rightValue - leftValue + 1;

    await Comment.deleteMany({
      comment_left: { $gte: leftValue, $lte: rightValue },
    });

    await Comment.updateMany(
      {
        comment_productId: convertToObjectId(productId),
        comment_left: { $gt: rightValue },
      },
      { $inc: { comment_left: -width } }
    );

    await Comment.updateMany(
      {
        comment_productId: convertToObjectId(productId),
        comment_right: { $gt: rightValue },
      },
      { $inc: { comment_right: -width } }
    );
    return true;
  }
}

module.exports = CommentService;
