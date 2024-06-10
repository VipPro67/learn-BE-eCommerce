"use strict";

const shopModel = require("../models/shop.model");

const select = {
  _id: 1,
  name: 1,
  email: 1,
  password: 1,
  role: 1,
  status: 1,
};

const findShopByEmail = async ({
  email
}) => {
  return await shopModel.findOne({ email }).select(select).lean();
};

const findShopById = async ({
  id
}) => {
  return await shopModel.findById(id).select(select).lean();
};

module.exports = {
  findShopByEmail,
  findShopById,
};
