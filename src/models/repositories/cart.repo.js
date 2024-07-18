"use strict";
const { cart } = require("../cart.model");
const { Types } = require("mongoose");
const { BadRequestError } = require("../../core/error.response");
const {
  getSelectFields,
  getUnSelectFields,
  convertToObjectId,
} = require("../../utils");

const createCart = async ({ userId, products = [] }) => {
  const query = { cart_userId: userId, cart_status: "active" },
    updateOrInsert = {
      $addToSet: { cart_products: { $each: products } },
      $inc: { cart_count_product: products.length },
    },
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

  return await Cart.findOneAndUpdate(query, updateOrInsert, options);
};

const getCartById = async ({ cartId }) => {
  return await cart.findOne({
    _id: cartId,
    cart_status: "active",
  });
};

const getCartByUserId = async ({ userId }) => {
  return await cart.findOne({ cart_userId: userId });
};

const updateCart = async ({ cartId, cart }) => {
  return await cart.updateOne({ _id, cart });
};

const deleteCart = async ({ cartId }) => {
  return await cart.deleteOne({ _id: cartId });
};

module.exports = {
  createCart,
  getCartById,
  getCartByUserId,
  updateCart,
  deleteCart,
};
