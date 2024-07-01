"use strict";

const ProductService = require("../services/product.service");
const { Created, OK } = require("../core/success.response");

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
}

module.exports = new ProductController();
