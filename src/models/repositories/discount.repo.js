"use strict";
const { discount } = require("../discount.model");
const { Types } = require("mongoose");
const { BadRequestError } = require("../../core/error.response");
const { getSelectFields, getUnSelectFields } = require("../../utils");

const createDiscount = async ({
  discount_name,
  discount_description,
  discount_type,
  discount_value,
  discount_code,
  discount_min_order_value,
  discount_max_usage_per_user,
  discount_start_date,
  discount_end_date,
  discount_apply_on,
  discount_product_ids,
  discount_max_usage,
  discount_shopId,
}) => {
  return await discount.create({
    discount_name,
    discount_description,
    discount_type,
    discount_value,
    discount_code,
    discount_min_order_value,
    discount_max_usage_per_user,
    discount_start_date,
    discount_end_date,
    discount_apply_on,
    discount_product_ids,
    discount_shopId,
    discount_max_usage,
  });
};

const updateDiscount = async ({ discount_code, shopId, bodyUpdate }) => {
  console.log("code/shopid", discount_code + "/" + shopId);
  const foundDiscount = await discount.findOne({
    discount_code: discount_code,
    discount_shopId: shopId,
  });
  if (!foundDiscount) {
    throw new Error("Discount not found");
  }
  return await discount.findOneAndUpdate(
    {
      discount_code: discount_code,
      discount_shopId: shopId,
    },
    bodyUpdate,
    {
      new: true,
    }
  );
};

const getAllDiscountCodeSelect = async ({
  limit = 10,
  sort = "ctime",
  page = 1,
  filter,
  select,
}) => {
  const query = {
    ...filter,
  };
  return await discount
    .find(query)
    .sort(sort === "ctime" ? { _id: 1 } : { _id: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .select(getSelectFields({ fields: select }))
    .lean()
    .exec();
};

const getAllDiscountCodeUnSelect = async ({
  limit = 10,
  sort = "ctime",
  page = 1,
  filter,
  unSelect,
}) => {
  return await discount
    .find(filter)
    .sort(sort === "ctime" ? { _id: 1 } : { _id: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .select(getUnSelectFields({ fields: unSelect }))
    .lean()
    .exec();
};

const getDiscount = async ({ filter }) => {
  return await discount.findOne(filter).lean().exec();
};

module.exports = {
  createDiscount,
  updateDiscount,
  getAllDiscountCodeSelect,
  getAllDiscountCodeUnSelect,
  getDiscount,
};
