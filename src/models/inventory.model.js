"use strict";
const { model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "inventories";

const inventorySchema = new Schema(
  {
    inventory_productId: {
      type: Types.ObjectId,
      ref: "Product",
      required: true,
    },
    inventory_location: {
      type: String,
    },
    inventory_stock: {
      type: Number,
      required: true,
    },
    inventory_shopId: {
      type: Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    inventory_reservations: {
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
  inventory: model(DOCUMENT_NAME, inventorySchema),
};
