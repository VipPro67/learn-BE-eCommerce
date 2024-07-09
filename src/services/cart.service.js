"use strict";
/*
feature: cart
1. add product to cart (user)
2. remove product from cart (user)
3. increase product quantity in cart (user)
4. decrease product quantity in cart (user)
5. get cart user
6. remove cart user
*/
const { cart } = require("../models/cart.model");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { discount } = require("../models/discount.model");
const { findProductById } = require("../models/repositories/product.repo");

class CartService {
  static async createUserCart({ userId, products = [] }) {
    const query = { cart_userId: userId, cart_status: "active" },
      updateOrInsert = {
        $addToSet: { cart_products: { $each: products } },
        $inc: { cart_count_product: products.length },
      },
      options = { upsert: true, new: true, setDefaultsOnInsert: true };

    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateCartQuantity({ userId, product }) {
    const { productId, product_quantity } = product;
    const query = {
        cart_userId: userId,
        "cart_products.productId": productId,
        cart_status: "active",
      },
      update = { $inc: { "cart_products.$.quantity": product_quantity } },
      options = { new: true, upsert: true };
    return await cart.findOneAndUpdate(query, update, options).exec();
  }

  static async addToCart({ userId, product = {} }) {
    const userCart = await cart.findOne({ cart_userId: userId });
    if (!userCart) {
      return await this.createUserCart({ userId, product });
    }

    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      userCart.cart_count_product = 1;
      await userCart.save();
      return userCart;
    }

    //check if product not exist this user cart
    const foundProduct = userCart.cart_products.find(
      (p) => p.productId === product.productId
    );
    if (!foundProduct) {
      userCart.cart_products.push(product);
      userCart.cart_count_product += 1;
      await userCart.save();
      return userCart;
    }

    return await this.updateCartQuantity({ userId, product });
  }

  static async addToCartV2({ userId, product = {} }) {
    const { productId, product_quantity, old_product_quantity } =
      shop_order_ids[0].itemProducts[0];
    const foundProduct = await findProductById({ product_id: productId });
    if (!foundProduct) {
      throw new NotFoundError("Product not found");
    }
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new BadRequestError("Product not found in this shop");
    }

    if (product_quantity === 0) {
      //delete product from cart
    }
    return await this.updateCartQuantity({
      userId,
      product: {
        productId,
        product_quantity: product_quantity - old_product_quantity,
      },
    });
  }

  static async removeProductFromCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_status: "active" },
      updateSet = {
        $pull: { cart_products: { productId } },
        $inc: { cart_count_product: -1 },
      };
    const removeCart = await cart.updateOne(query, updateSet);
    return removeCart;
  }

  static async getCartByUserId({ userId }) {
    return await cart.findOne({ cart_userId: userId }).lean();
  }
}

module.exports = CartService;
