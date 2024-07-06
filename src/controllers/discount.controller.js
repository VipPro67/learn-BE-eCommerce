"use strict";
const DiscountService = require("../services/discount.service");
const { Created, OK } = require("../core/success.response");
const { discount } = require("../models/discount.model");

class DiscountController {
  async createDiscountCode(req, res, next) {
    try {
      const discount = await DiscountService.createDiscountCode({
        ...req.body,
        discount_shopId: req.keyStore.userId,
      });
      new Created("Create new discount code success", discount).send(res);
    } catch (error) {
      next(error);
    }
  }

  async updateDiscountCode(req, res, next) {
    try {
      const discount = await DiscountService.updateDiscountCode({
        discount_code: req.params.discount_code,
        discount_shopId: req.keyStore.userId,
        bodyUpdate: req.body,
      });
      new Created("Create new discount code success", discount).send(res);
    } catch (error) {
      next(error);
    }
  }
  async getAllDiscountCodeSelect(req, res, next) {
    try {
      const discounts = await DiscountService.getAllDiscountByShop({
        shopId: req.keyStore.userId,
      });
      new OK("Get all discount code success", discounts).send(res);
    } catch (error) {
      next(error);
    }
  }

  async getAllDiscountCodeUnSelect(req, res, next) {
    try {
      const discounts = await DiscountService.getAllDiscountCodeUnSelect();
      new OK("Get all discount code unselect success", discounts).send(res);
    } catch (error) {
      next(error);
    }
  }

  async getProductByDiscountCode(req, res, next) {
    try {
      const discount = await DiscountService.getProductByDiscountCode({
        discount_code: req.body.discount_code,
        discount_shopId: req.body.discount_shopId,
      });
      new OK("Get discount success", discount).send(res);
    } catch (error) {
      next(error);
    }
  }

  async getAllDiscountAmount(req, res, next) {
    try {
      const discount = await DiscountService.getAllDiscountAmount({
        ...req.body,
        userId: req.keyStore.userId,
      });
      new OK("Apply discount code success", discount).send(res);
    } catch (error) {
      next(error);
    }
  }
  async deleteDiscountCode(req, res, next) {
    try {
      const discount = await DiscountService.deleteDiscountCode(
        req.params.discount_code
      );
      new OK("Delete discount code success", discount).send(res);
    } catch (error) {
      next(error);
    }
  }

  async cancelDiscount(req, res, next) {
    try {
      const discount = await DiscountService.cancelDiscount(
        req.params.discount_code
      );
      new OK("Cancel discount success", discount).send(res);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new DiscountController();
