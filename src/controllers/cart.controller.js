"use strict";
const CartService = require("../services/cart.service");
const { Created, OK } = require("../core/success.response");
class CartController {
  async addToCart(req, res, next) {
    try {
      const { userId, product } = req.body;
      const result = await CartService.addToCart({ userId, product });
      return new Created("Add product to cart success", result).send(res);
    } catch (error) {
      next(error);
    }
  }

  async updateCartQuantity(req, res, next) {
    try {
      const { userId, product } = req.body;
      const result = await CartService.updateCartQuantity({ userId, product });
      return new Created("Update product quantity success", result).send(res);
    } catch (error) {
      next(error);
    }
  }

  async deleleCart(req, res, next) {
    try {
      const { userId, productId } = req.body;
      const result = await CartService.removeProductFromCart({
        userId,
        productId,
      });
      return new OK("Delete cart success", result).send(res);
    } catch (error) {
      next(error);
    }
  }

  async getCartByUserId(req, res, next) {
    try {
      const { userId } = req.body;
      const result = await CartService.getCartByUserId({ userId });
      return new OK("Get cart by user success", result).send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CartController();
