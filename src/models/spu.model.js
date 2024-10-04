const { Schema, model } = require("mongoose");
const slugify = require("slugify");

const DOCUMENT_NAME = "Spu";
const COLLECTION_NAME = "Spus";

const spuSchema = new Schema(
  {
    product_id: { type: String, default: "" },
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_slug: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_category: { type: [String], default: [] },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      // 4.3334 => 4.3
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: [
      {
        tier_variation: [
          {
            images: { type: [String], default: [] },
            name: { type: String, required: true },
            options: { type: [String], required: true },
          },
        ],
      },
    ],
    /*
       tier_variation:[
       {
         images: [],
         name: 'color',
         options: ['red', 'green']
       },
       {
         images: [],
         name: 'size',
         options: ['S', 'M']
       } 
       ]
    */
    isDraft: { type: Boolean, default: true, index: true, select: true },
    isPublished: { type: Boolean, default: false, index: true, select: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
spuSchema.index({ product_name: "text", product_description: "text" });

spuSchema.pre("save", function (next) {
  if (this.isModified("product_name")) {
    this.product_slug = slugify(this.product_name, { lower: true });
  }
  next();
});

module.exports = {
  spuModel: model(DOCUMENT_NAME, spuSchema, COLLECTION_NAME),
};
