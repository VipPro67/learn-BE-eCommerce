"use strict";

const CheckoutService = require("../services/checkout.service");
const { OK } = require("../core/success.response");

class CheckoutController {
  checkoutReview = async (req, res, next) => {
    try {
      const checkout = await CheckoutService.reviewOrder({
        cartId: req.body.cartId,
        userId: req.keyStore.userId,
        shop_order_ids: req.body.shop_order_ids,
      });
      new OK("Review order success", checkout).send(res);
    } catch (error) {
      next(error);
    }
  };

  orderByUser = async (req, res, next) => {
    try {
      const order = await CheckoutService.orderByUser({
        userId: req.keyStore.userId,
        shop_order_ids: req.body.shop_order_ids,
        cartId: req.body.cartId,
        user_address: req.body.user_address,
        user_payment: req.body.user_payment,
      });
      new OK("Order by user success", order).send;
    } catch (error) {
      next(error);
    }
  };

  getOrderByUser = async (req, res, next) => {
    try {
      const order = await CheckoutService.getOrderByUser({
        userId: req.keyStore.userId,
      });
      new OK("Get order by user success", order).send(res);
    } catch (error) {
      next(error);
    }
  };

  cancelOrderByUser = async (req, res, next) => {
    try {
      const order = await CheckoutService.cancelOrderByUser({
        orderId: req.body.orderId,
      });
      new OK("Cancel order by user success", order).send(res);
    } catch (error) {
      next(error);
    }
  };

  updateOrderByShop = async (req, res, next) => {
    try {
      const order = await CheckoutService.updateOrderByShop({
        orderId: req.body.orderId,
        status: req.body.status,
      });
      new OK("Update order by shop success", order).send(res);
    } catch (error) {
      next(error);
    }
  };

}

module.exports = new CheckoutController();
