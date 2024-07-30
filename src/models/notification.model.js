"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "notifications";

const notificationSchema = new Schema(
  {
    noti_type: {
      type: String,
      enum: ["ORDER", "MESSAGE", "PROMOTION","PRODUCT"],
    },
    noti_senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    noti_receiverId: {
      //   type: Schema.Types.ObjectId,
      //   ref: "User",
      type: Number,
      required: true,
    },
    noti_content: {
      type: String,
      required: true,
    },
    noti_options: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  notification: model(DOCUMENT_NAME, notificationSchema),
};
