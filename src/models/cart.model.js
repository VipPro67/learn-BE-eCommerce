"use strict";
const { model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "carts";

const cartsSchema = new Schema(
  {
    cart_status: {
      type: String,
      required: true,
      default: "active",
      enum: ["active", "inactive", "completed", "cancelled", "pending"],
    },
    cart_products: {
      type: Array,
      default: [],
    },
    /*
        productId: 1,
        shopId: 1,
        quantity: 1,
        price: 10000,
        name: "Product 1"
        */
    cart_count_product: {
      type: Number,
      default: 0,
    },
    cart_userId: {
      type: Number,
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = {
  cart: model(DOCUMENT_NAME, cartsSchema, COLLECTION_NAME),
};
