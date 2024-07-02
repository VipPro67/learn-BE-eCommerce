"use strict";

const ProductService = require("../services/product.service");
const { Created, OK, SuccessResponse } = require("../core/success.response");

class ProductController {
  async createProduct(req, res, next) {
    try {
      const product = await ProductService.createProduct(
        req.body.product_type,
        req.body
      );
      new Created("Create new product success", product).send(res);
    } catch (error) {
      next(error);
    }
  }

  async getAllDraftForShop(req, res, next) {
    try {
      const products = await ProductService.findAllDraftForShop({
        product_shop: req.keyStore.userId,
      });
      new OK("Get all draft product success", products).send(res);
    } catch (error) {
      next(error);
    }
  }

  async publicProductByShop(req, res, next) {
    try {
      const product = await ProductService.publicProductByShop({
        product_shop: req.keyStore.userId,
        product_id: req.params.product_id,
      });
      new OK("Public product success", product).send(res);
    } catch (error) {
      next(error);
    }
  }

  async unPublicProductByShop(req, res, next) {
    try {
      const product = await ProductService.unPublicProductByShop({
        product_shop: req.keyStore.userId,
        product_id: req.params.product_id,
      });
      new OK("Unpublic product success", product).send(res);
    } catch (error) {
      next(error);
    }
  }

  async getAllPublicProductByShop(req, res, next) {
    try {
      const products = await ProductService.findAllPublicProductByShop({
        product_shop: req.keyStore.userId,
      });
      new OK("Get all public product success", products).send(res);
    } catch (error) {
      next(error);
    }
  }

  // async findProductById(req, res, next) {
  //   try {
  //     const product = await ProductService.findProductById(
  //       req.params.product_id
  //     );
  //     new OK("Get product by id success", product).send(res);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  async searchProductsUser(req, res, next) {
    try {
      const products = await ProductService.searchProductsUser({
        keysearch: req.params.keysearch,
      });
      new OK("Search products success", products).send(res);
    } catch (error) {
      next(error);
    }
  }

  async findAllProducts(req, res, next) {
    try {
      const products = await ProductService.findAllProducts(req.query);
      new OK("Get all products success", products).send(res);
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const product = await ProductService.updateProduct(
        req.params.product_id,
        req.body
      );
      new OK("Update product success", product).send(res);
    } catch (error) {
      next(error);
    }
  }

  async findProductById(req, res, next) {
    try {
      const product = await ProductService.findProductById({
        product_id: req.params.product_id,
      });
      new OK("Get product by id success", product).send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
