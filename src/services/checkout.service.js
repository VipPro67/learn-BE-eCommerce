"use strict";

const { getCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { getAllDiscountAmount } = require("./discount.service");
const { convertToObjectId } = require("../utils");
const { acquireLock, releaseLock } = require("./redis.service");
const { order } = require("../models/order.model");

class CheckoutService {
  static async reviewOrder({ cartId, userId, shop_order_ids = [] }) {
    const foundCart = await getCartById({ cartId: convertToObjectId(cartId) });
    if (!foundCart) {
      throw new NotFoundError("Error: Cart not found", cartId);
    }

    const checkoutOrder = {
        totalPrice: 0,
        feeShipping: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      new_shop_order_ids = [];

    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shopDiscounts = [],
        itemProducts = [],
      } = shop_order_ids[i];
      const checkProducts = await checkProductByServer({
        products: itemProducts,
      });
      if (!checkProducts) {
        throw new BadRequestError("Error: Order wrong");
      }

      const checkoutPrice = checkProducts.reduce((acc, product) => {
        const { price, quantity } = product;
        return acc + price * quantity;
      }, 0);

      checkoutOrder.totalPrice += checkoutPrice;
      const itemCheckout = {
        shopId,
        shopDiscounts: shopDiscounts,
        priceRaw: checkoutPrice,
        priceApllyDiscount: checkoutPrice,
        itemProducts: checkProducts,
      };
      //calculate discount
      if (shopDiscounts.length > 0) {
        const { totalOrder = 0, discountAmount = 0 } =
          await getAllDiscountAmount({
            discount_code: shopDiscounts[0].discountCode,
            discount_shopId: shopDiscounts[0].shopId,
            userId,
            products: checkProducts,
          });
        checkoutOrder.totalDiscount += discountAmount;
        if (discountAmount > 0) {
          itemCheckout.priceApllyDiscount = totalOrder - discountAmount;
        }
      }

      checkoutOrder.totalCheckout += itemCheckout.priceApllyDiscount;
      new_shop_order_ids.push(itemCheckout);
    }
    return {
      shop_order_ids,
      new_shop_order_ids,
      checkoutOrder,
    };
  }

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    use_payment = {},
  }) {
    const { new_shop_order_ids, checkout_order } = await this.reviewOrder({
      cartId,
      userId,
      shop_order_ids: shop_order_ids,
    });

    const products = new_shop_order_ids.flatMap((item) => item.itemProducts);
    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }
    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        "Error: Some product is not available. Please review your order again."
      );
    }

    //create order
    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: use_payment,
      order_products: new_shop_order_ids,
    });
    if (newOrder) {
      //remove product from cart
    }
  }

  static async getOrderByUser({ userId }) {
    return await order.find({ order_userId: userId });
  }

  static async getOrderById({ orderId }) {
    return await order.findById(orderId);
  }

  static async cancelOrderByUser({ orderId }) {
    const foundOrder = await order.findById(orderId);
    if (!foundOrder) {
      throw new NotFoundError("Error: Order not found", orderId);
    }
    if (foundOrder.order_status === "cancel") {
      throw new BadRequestError("Error: Order already cancel", orderId);
    }
    const updateOrder = await order.findByIdAndUpdate(
      orderId,
      { order_status: "cancel" },
      { new: true }
    );
    if (!updateOrder) {
      throw new BadRequestError("Error: Order cancel fail", orderId);
    }
    return updateOrder;
  }

  static async updateOrderByShop({ orderId, status }) {
    const foundOrder = await order.findById(orderId);
    if (!foundOrder) {
      throw new NotFoundError("Error: Order not found", orderId);
    }
    if (foundOrder.order_status === status) {
      throw new BadRequestError("Error: Order already " + status, orderId);
    }
    const updateOrder = await order.findByIdAndUpdate(
      orderId,
      { order_status: status },
      { new: true }
    );
    if (!updateOrder) {
      throw new BadRequestError("Error: Order update fail", orderId);
    }
    return updateOrder;
  }
}

module.exports = CheckoutService;
