'use strict'
const { model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "orders";

const orderSchema = new Schema({
    order_userId: {
        // type: Types.ObjectId,
        // ref: "User",
        type: Number,
        required: true,
    },
    order_checkout: {
        type: Object,
        required: true,
    },
    order_shipping: {
        type: Object,
        required: true,
    },
    order_payment: {
        type: Object,
        required: true,
    },
    order_products: {
        type: Array,
        default: [],
    },      
    order_status: {
        type: String,
        default: "pending",
        enum: ["pending", "confirmed", "shipping", "delivered", "canceled"],
    },},
    {   
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = {
    order: model(DOCUMENT_NAME, orderSchema),
};
