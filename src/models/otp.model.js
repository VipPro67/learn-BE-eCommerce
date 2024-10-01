import e from "express";
import { Document, Schema, model } from "mongoose";

const DOCUMENT_NAME = "OtpLog";
const COLLECTION_NAME = "otp_logs";

const otpSchema = new Schema(
  {
    otp_token: {
      type: Number,
      required: true,
      unique: true,
    },
    otp_email: {
      type: String,
      required: true,
    },
    otp_status: {
      type: String,
      default: "active",
    },
    expired_at: {
      type: Date,
      default: Date.now(),
      expires: 300,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
