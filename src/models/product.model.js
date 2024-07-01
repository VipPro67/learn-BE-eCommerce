"use strict";
const e = require("express");
const { model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "products";

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumbnail: {
      type: String,
      required: true,
    },
    product_shop: {
      type: Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ["food", "drink", "electronic", "clothes", "furniture"],
    },
    product_description: {
      type: String,
    },
    product_atributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const clothesSchema = new Schema(
  {
    size: {
      type: String,
    },
    color: {
      type: String,
    },
    material: {
      type: String,
    },
    brand: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "clothes",
  }
);

const foodSchema = new Schema(
  {
    weight: {
      type: Number,
    },
    calories: {
      type: Number,
    },
    ingredients: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "food",
  }
);

const drinkSchema = new Schema(
  {
    volume: {
      type: Number,
    },
    calories: {
      type: Number,
    },
    ingredients: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "drink",
  }
);

const electronicSchema = new Schema(
  {
    brand: {
      type: String,
    },
    manufacturer: {
      type: String,
    },
    model: {
      type: String,
    },
    color: {
      type: String,
    },
    weight: {
      type: Number,
    },
  },
  {
    timestamps: true,
    collection: "electronic",
  }
);

const furnitureSchema = new Schema(
  {
    weight: {
      type: Number,
    },
    color: {
      type: String,
    },
    material: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "furniture",
  }
);

const Product = model(DOCUMENT_NAME, productSchema);
const Clothes = model("Clothes", clothesSchema);
const Food = model("Food", foodSchema);
const Drink = model("Drink", drinkSchema);
const Electronic = model("Electronic", electronicSchema);
const Furniture = model("Furniture", furnitureSchema);

module.exports = {
  Product,
  Clothes,
  Food,
  Drink,
  Electronic,
  Furniture,
};
