"use strict";

const CheckoutService = require("../services/checkout.service");
const { OK } = require("../core/success.response");

class CheckoutController {
  checkoutReview = async (req, res, next) => {
    try {
      const checkout = await CheckoutService.reviewOrder({
        ...req.body,
      });
      new OK("Review order success", checkout).send(res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new CheckoutController();
