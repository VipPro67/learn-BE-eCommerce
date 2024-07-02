"use strict";
const {
  product,
  clothes,
  electronic,
  food,
  drink,
  furniture,
} = require("../product.model");
const { Types } = require("mongoose");
const { BadRequestError } = require("../../core/error.response");
const { update } = require("lodash");

const findAllDraftForShop = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const publicProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await product.findOne({
    _id: product_id,
    product_shop,
  });
  if (!foundProduct) {
    throw new BadRequestError("Product not found");
  }
  return await product.updateOne(
    { _id: product_id, product_shop },
    { isPublished: true }
  );
};

const unPublicProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await product.findOne({
    _id: product_id,
    product_shop,
  });
  if (!foundProduct) {
    throw new BadRequestError("Product not found");
  }
  return await product.updateOne(
    { _id: product_id, product_shop },
    { isPublished: false }
  );
};

const findAllPublicProductByShop = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

module.exports = {
  findAllDraftForShop,
  publicProductByShop,
  unPublicProductByShop,
  findAllPublicProductByShop,
};
