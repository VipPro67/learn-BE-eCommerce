"use strict";

const { model, Schema } = require("mongoose");
const mongoose = require("mongoose");


const DOCUMENT_NAME = "Role";
const COLLECTION_NAME = "Roles";


const roleSchema = new Schema(
  {
    rol_name: { type: String, default: "user" },
    rol_slug: { type: String, required: true },
    rol_enum: { type: String, enum: ["user", "shop", "admin"] },
    rol_status: {
      type: String,
      default: "active",
      enum: ["active", "blocked", "pending"],
    },
    rol_description: { type: String, default: "" },
    rol_grants: [
      {
        resource: {
          type: Schema.Types.ObjectId,
          ref: "Resource",
          required: true,
        },
        actions: [{ type: String, required: true }],
        attributes: { type: String, default: "" },
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  role: model(DOCUMENT_NAME, roleSchema),
}
