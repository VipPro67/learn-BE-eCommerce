"use strict";

const { getCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { getAllDiscountAmount } = require("./discount.service");
const { convertToObjectId } = require("../utils");

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
}

module.exports = CheckoutService;
