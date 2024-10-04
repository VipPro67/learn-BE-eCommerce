const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Sku";
const COLLECTION_NAME = "Skus";

const skuSchema = new Schema(
  {
    sku_id: { type: String, require: true, unique: true },
    sku_tier_idx: { type: [Number], default: [0] }, // [0,1] = [red,green]
    /*
    color = [red,green] = [0,1]
    size = [S,M]= [0,1]
    material = [cotton,wool] = [0,1]
    red-S-cotton = 0-0-0
    red-S-wool = 0-0-1
    */
    sku_default: { type: Boolean, default: false },
    sku_slug: { type: String, default: "" },
    sku_sort: { type: Number, default: 0 },
    sku_price: { type: String, require: true },
    sku_stock: { type: Number, default: 0 },
    product_id: { type: String, required: true }, // product_id in SPU
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = {
  skuModel: model(DOCUMENT_NAME, skuSchema, COLLECTION_NAME),
}
