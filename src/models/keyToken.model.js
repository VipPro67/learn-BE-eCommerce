"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "keys";

var keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "shops",
      required: true,
    },

    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      require: true,
    },
    refreshTokenUsed: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, keyTokenSchema);
