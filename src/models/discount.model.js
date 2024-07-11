"use strict";
const { model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

const discountsSchema = new Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      required: true,
      default: "percentage", //percentage or fixed
    },
    discount_value: {
      type: Number, // 15% or 15000
      required: true,
    },
    discount_code: {
      type: String,
      required: true,
    },
    discount_min_order_value: {
      type: Number,
      required: true,
    },
    discount_start_date: {
      type: Date,
      required: true,
    },
    discount_end_date: {
      type: Date,
      required: true,
    },
    discount_max_usage: {
      type: Number,
      required: true,
    },
    //number of times the discount had been used
    discount_usage: {
      type: Number,
      required: true,
      default: 0,
    },
    discount_max_usage_per_user: {
      type: Number,
      required: true,
      default: 0, //0 mean no limit
    },
    discount_user_usage: {
      type: Array,
      default: [],
    },
    discount_shopId: {
      type: Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    discount_is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
    discount_apply_on: {
      type: String,
      required: true,
      enum: ["all", "products"],
    },
    discount_product_ids: {
      type: Array,
      default: [],
    },
  },

  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  discount: model(DOCUMENT_NAME, discountsSchema, COLLECTION_NAME),
};
