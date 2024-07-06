"use strict";
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { discount } = require("../models/discount.model");
const {
  convertToObjectId,
  updateNestedObject,
  removeUndefined,
} = require("../utils");
const {
  createDiscount,
  updateDiscount,
  getAllDiscountCodeSelect,
  getAllDiscountCodeUnSelect,
  getDiscount,
} = require("../models/repositories/discount.repo");

const { findAllProducts } = require("../models/repositories/product.repo");

/*
1. gerenate a discount code by shop or admin
2. get all discounts by shop, user
3. get discount amount by user, discount code
4. verify discount code
5. delete discount code by shop, admin
6. cancel discount by user
 */
class DiscountService {
  static async createDiscountCode(payload) {
    const {
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      discount_code,
      discount_min_order_value,
      discount_max_usage_per_user,
      discount_start_date,
      discount_end_date,
      discount_max_usage,
      discount_apply_on,
      discount_product_ids,
      discount_shopId,
    } = payload;
    //check date

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new BadRequestError("Discount date is invalid");
    }

    if (new Date(discount_start_date) > new Date(discount_end_date)) {
      throw new BadRequestError("Start date must be less than end date");
    }

    const foundDiscount = await discount.findOne({
      discount_code,
      discount_shopId,
    });
    if (foundDiscount) {
      throw new BadRequestError("Discount code already exists");
    }
    return await createDiscount({
      discount_name: discount_name,
      discount_description: discount_description,
      discount_type: discount_type,
      discount_value: discount_value,
      discount_code: discount_code,
      discount_min_order_value: discount_min_order_value,
      discount_max_usage_per_user: discount_max_usage_per_user,
      discount_start_date: discount_start_date,
      discount_end_date: discount_end_date,
      discount_apply_on: discount_apply_on,
      discount_product_ids: discount_product_ids,
      discount_max_usage: discount_max_usage,
      discount_shopId: convertToObjectId(discount_shopId),
    });
  }

  static async updateDiscountCode({
    discount_code,
    discount_shopId,
    bodyUpdate,
  }) {
    const objectParams = updateNestedObject(bodyUpdate);
    return await updateDiscount({
      discount_code: discount_code,
      shopId: discount_shopId,
      bodyUpdate: removeUndefined(objectParams),
    });
  }

  static async getProductByDiscountCode({
    discount_code,
    discount_shopId,
    user_id,
    limit,
    page,
  }) {
    const foundDiscount = await discount.findOne({
      discount_code: discount_code,
      discount_shopId,
    });
    if (!foundDiscount) {
      throw new BadRequestError("Discount code not found");
    }

    if (foundDiscount.discount_max_usage <= foundDiscount.discount_usage) {
      throw new BadRequestError("Discount code is expired");
    }

    if (foundDiscount.discount_user_usage.includes(user_id)) {
      throw new BadRequestError("Discount code is already used");
    }

    if (foundDiscount.discount_min_order_value > limit) {
      throw new BadRequestError("Discount code is invalid");
    }

    if (foundDiscount.discount_apply_on === "all") {
      return await findAllProducts({
        limit,
        page,
        filter: {
          product_shop: convertToObjectId(foundDiscount.discount_shopId),
          isPublished: true,
        },
      });
    } else if (foundDiscount.discount_apply_on === "type") {
      return await findAllProducts({
        limit,
        page,
        filter: {
          product_shop: convertToObjectId(foundDiscount.discount_shopId),
          product_type: { $in: foundDiscount.discount_product_ids },
          isPublished: true,
        },
        select: ["product_name", "product_thumbnail", "product_price"],
      });
    } else {
      return await findAllProducts({
        limit,
        page,
        filter: {
          product_shop: convertToObjectId(foundDiscount.discount_shopId),
          _id: { $in: foundDiscount.discount_product_ids },
          isPublished: true,
        },
      });
    }
  }

  static async getAllDiscountByShop({ limit, page, shopId }) {
    const foundDiscounts = await getAllDiscountCodeUnSelect({
      limit: limit,
      page: page,
      filter: { discount_shopId: convertToObjectId(shopId) },
      unSelect: ["__v", "discount_shopId"],
    });

    return foundDiscounts;
  }

  static async getAllDiscountAmount({
    discount_code,
    discount_shopId,
    userId,
    products,
  }) {
    const foundDiscount = await getDiscount({
      filter: {
        discount_code: discount_code,
        discount_shopId: discount_shopId,
      },
    });

    if (!foundDiscount) {
      throw new NotFoundError("Discount code not found");
    }

    const {
      discount_is_active,
      discount_max_usage,
      discount_type,
      discount_value,
      discount_user_usage,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_usage_per_user,
    } = foundDiscount;

    if (!discount_is_active) {
      throw new BadRequestError("Discount code is not active");
    }

    if (!discount_max_usage) {
      throw new BadRequestError("Discount code is out of usage");
    }
    if (discount_max_usage_per_user > 0) {
      let count = 0;
      for (const user of discount_user_usage) {
        if (user === userId) {
          count++;
        }
      }
      if (count >= discount_max_usage_per_user) {
        throw new BadRequestError("Discount code is out of usage for user");
      }
    }
    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new BadRequestError("Discount code is expired");
    }
    let totalOrder = 0;
    for (const product of products) {
      totalOrder += product.product_price * product.product_quantity;
    }
    if (totalOrder < discount_min_order_value) {
      throw new BadRequestError("Discount code min order value is invalid");
    }

    const amountDiscount =
      discount_type === "percentage"
        ? (discount_value / 100) * totalOrder
        : discount_value;

    return {
      totalOrder: totalOrder,
      discountAmount: amountDiscount,
      totalPrice: totalOrder - amountDiscount,
    };
  }

  static async cancelDiscountCode({ discount_code, shopId, userId }) {
    const foundDiscount = await discount.findOne({
      discount_code,
      discount_shopId: convertToObjectId(shopId),
    });
    if (!foundDiscount) {
      throw new NotFoundError("Discount code not found");
    }
    if (!foundDiscount.discount_user_usage.includes(userId)) {
      throw new BadRequestError("Discount code is not used by user");
    }
    return await updateDiscount({
      discount_id: foundDiscount._id,
      shopId: shopId,
      bodyUpdate: { $pull: { discount_user_usage: userId } },
    });
  }
}

module.exports = DiscountService;
