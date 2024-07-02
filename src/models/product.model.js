"use strict";
const slugify = require("slugify");
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
    product_slug: {
      type: String,
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
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
    product_ratingAvg: {
      type: Number,
      default: 4.5,
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating must not exceed 5"],
      set: (value) => Math.round(value * 10) / 10,
    },
    product_variations: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

//create index for search
productSchema.index({ product_name: "text", product_description: "text" });

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

const product = model(DOCUMENT_NAME, productSchema);
const clothes = model("Clothes", clothesSchema);
const food = model("Food", foodSchema);
const drink = model("Drink", drinkSchema);
const electronic = model("Electronic", electronicSchema);
const furniture = model("Furniture", furnitureSchema);

module.exports = {
  product,
  clothes,
  food,
  drink,
  electronic,
  furniture,
};
