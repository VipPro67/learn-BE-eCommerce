"use strict";
const { inventory } = require("../inventory.model");
const { Types } = require("mongoose");
const { convertToObjectId } = require("../../utils");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknow",
}) => {
  return await inventory.create({
    inventory_productId: productId,
    inventory_location: location,
    inventory_stock: stock,
    inventory_shopId: shopId,
  });
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
      inventory_productId: convertToObjectId(productId),
      inventory_stock: { $gte: quantity },
    },
    updateSet = {
      $inc: { inventory_stock: -quantity },
      $push: {
        inventory_reservations: {
          cartId: convertToObjectId(cartId),
          quantity,
          createdAt: new Date(),
        },
      },
    },
    options = { upsert: true, new: true };
  return await inventory.updateOne(query, updateSet, options);
};

module.exports = {
  insertInventory,
  reservationInventory,
};
