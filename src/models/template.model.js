const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "template";
const COLLECTION_NAME = "templates";

const templateSchema = new Schema(
  {
    tem_id: {
      type: Number,
      required: true,
      unique: true,
      default: () => Number(Date.now().toString().slice(-5)),
    },
    tem_name: { type: String, required: true },
    tem_status: {
      type: String,
      default: "active",
    },
    tem_html: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
module.exports = {
  template: model(DOCUMENT_NAME, templateSchema),
}